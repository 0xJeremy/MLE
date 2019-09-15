'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('fireeye');
const Analyzer = require('./analyze.js');
const RobotNav = require('./navControl.js');
const GodMode = require('./god.js');
const GenRobotInstruct = require('./genRobotInstructions.js');

var SPEED = 75;
var DURATION = 0.5;

function MLE(io, socket, botNum) {
	this.socket = socket;
	this.io = io;

	this.rNum = botNum

	this.searchItem = 'person';
	this.nav = new RobotNav(botNum);
	this.nav.setState('STOPPED');

	this.ioSocket = null;

	this.godmode = new GodMode(io, socket);

	this.godmodeOn = false;
	this.description = '';
	this.found = false;

	this.waiting = false

	this.report = function(message) {
		console.log('Bot ' + this.rNum + ': ' + message);
	}

	this.io.on('connection', (ioSocket) => {

		this.ioSocket = ioSocket;

		ioSocket.on('speech', (data) => {
			this.textAnalysis(data)
				.then(item => {
					this.searchItem = item;
					ioSocket.emit('searchItem', item);
				})
				.catch(console.error);
		});

		ioSocket.on('confirmItem', (data) => {
			if(JSON.parse(data)['response'] && !this.godmodeOn){
				this.nav.setState('SEARCHING');
				this.report('Rollout!!!');
			}
		});

		ioSocket.on('manual'+this.rNum, (data) => {
			this.report('Got command: ' + data)
			var cmd = ''
			if(data == 'FORWARD') {cmd = GenRobotInstruct.genForward(SPEED, DURATION);}
			if(data == 'LEFT') {cmd = GenRobotInstruct.genLeft(-SPEED, DURATION/4);}
			if(data == 'RIGHT') {cmd = GenRobotInstruct.genRight(SPEED,DURATION/4);}
			if(data == 'BACK') {cmd = GenRobotInstruct.genBack(SPEED, DURATION);}
			socket.write('instructions', cmd);
		});
	});

	this.textAnalysis = async function(data){

		// Instantiates a client
		const client = new language.LanguageServiceClient();

		// The text to analyze
		const text = data;

		const document = {
			content: text,
		 	type: 'PLAIN_TEXT',
		};

		// Detects the entities of the text
		const [result] = await client.analyzeEntities({document: document});
		const entities = result.entities;
		const item = entities[0].name;

		return item;

	};

	this.socket.on('image', (data) => {
	 	this.io.emit('image'+this.rNum, data);
				
	 	if(!this.waiting){
	 		this.waiting = true;
			let subscriptionKey = process.env['AZURE_KEY'];
			let endpoint = process.env['AZURE_ENDPOINT'];
			if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }
			
			var uriBase = endpoint + 'vision/v2.0/analyze';

			const params = {
			    'visualFeatures': 'Description,Tags',
			    'details': '',
			    'language': 'en'
			};
			var buf = Buffer.from(data, 'base64');

			const options = {
			    uri: uriBase,
			    qs: params,
			    body: buf,
			    headers: {
			        'Content-Type': 'application/octet-stream',
			        'Ocp-Apim-Subscription-Key' : subscriptionKey
			    }
			};

			request.post(options, (error, response, body) => {
			  if (error) {
			    this.report('Error: ', error);
			    return;
			  }

			  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

			  var tags=JSON.parse(body)['tags'];
			  var hi_conf_objects = tags.filter(tag => tag.confidence > .8).map(tag=>tag.name);
			  this.report("Objects: " + hi_conf_objects);
			  if(JSON.parse(body)['description']['captions'][0] != undefined) {
	    		  this.description = JSON.parse(body)['description']['captions'][0].text;
			  }

			  if(hi_conf_objects.includes(this.searchItem)){
			  		this.report("Found a " + this.searchItem);
			  		this.found = true;
			  		this.nav.setState('FOUND')
		  			this.finale();
			  }
			  this.waiting = false;

			});
		}
	});

	this.socket.on('cmdAck', (data) => {
		cmd = this.nav.getCmd();
		this.report("Sending instruction " + cmd)
		this.socket.write('instructions', cmd);
	});

	this.actiavteGM = function(){
		this.godmode.godControl();
		this.godmodeOn=true;
	}

	this.finale = function(){
		this.ioSocket.emit('found', this.description);
		this.report('Done!');
	}

}

module.exports = MLE;
