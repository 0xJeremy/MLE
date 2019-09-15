'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('fireeye');
const Analyzer = require('./analyze.js');
const RobotNav = require('./navControl.js');
const GodMode = require('./god.js');


function MLE(io, socket) {
	this.socket = socket;
	this.io = io;

	this.search_item = 'person';
	this.nav = new RobotNav(socket);
	this.nav.setState('STOPPED')

	this.godmode = new GodMode(io, socket);

	this.godmodeOn = false;
	this.description = '';
	this.found = false;

	this.waiting = false


	this.startFlow = function(){
		this.io.on('connection', (ioSocket) => {

			ioSocket.on('speech', (data) => {
				this.analyzer.textAnalysis(data)
					.then(item => {
						this.search_item = item;
						ioSocket.emit('searchItem',item);
					})
					.catch(console.error);
			});

			ioSocket.on('confirmItem', (data) => {
				this.beginSearch();
				if(JSON.parse(data)['response'] && !this.godmodeOn){
					this.nav.setState('SEARCHING');
					console.log('Rollout!!!');
				}

			});
		});
	}

	this.socket.on('image', (data) => {
	 	this.io.emit('image', data);
				
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
			    console.log('Error: ', error);
			    return;
			  }

			  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

			  var tags=JSON.parse(body)['tags'];
			  var hi_conf_objects = tags.filter(tag => tag.confidence > .8).map(tag=>tag.name);
			  console.log(hi_conf_objects);

			  this.description = JSON.parse(body)['description']['captions'][0].text;

			  if(hi_conf_objects.includes(this.search_item)){
			  		console.log("Found a " + this.search_item);
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
		console.log("Sending instruction " + cmd)
		this.socket.write('instruction', cmd);
	})

	this.actiavteGM = function(){
		this.godmode.godControl();
		this.godmodeOn=true;
	}

	this.finale = function(){
		console.log('Done!');
	}

}

module.exports = MLE;
