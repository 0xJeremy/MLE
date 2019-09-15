'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('fireeye');
const Analyzer = require('./analyze.js');
const RobotNav = require('./navControl.js');
const GodMode = require('./god.js');


class MLE{
	constructor(io, socket){
		this.socket = socket;
		this.io = io;

		this.analyzer = new Analyzer(this.callback);
		this.search_item = 'person';
		this.nav = new RobotNav(socket);
		this.godmode = new GodMode(io, socket);

		this.godmodeOn = false;

	}

	startFlow(){
		this.io.on('connection', (ioSocket) => {

			// Find item to search for
			ioSocket.on('search', (data) => {
				console.log(data);

				this.analyzer.textAnalysis(data)
					.then(item => {

						console.log(item);
						this.search_item = item;
						ioSocket.emit('search_item',item);
					})
					.catch(console.error);
			});

			ioSocket.on('confirmed_search', (data) => {
				// Run the search!!!
				this.beginSearch();
				if(JSON.parse(data)['response'] && !this.godmodeOn){
					this.nav.autobots_rollout();
					console.log('Rollout!!!');

				}

			});
		});
	}

	callback(description, found) {
		console.log("IN CALLBACK");
		this.description = description;
		this.found = found;
	}

	beginSearch(){
		// this.nav.autobots_rollout();
		var x = 0;
		this.socket.on('image', (data) => {
		 	this.io.emit('image', data);
			
			
		 	if(x == 0){

				let subscriptionKey = process.env['AZURE_KEY'];
				let endpoint = process.env['AZURE_ENDPOINT'];
				if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }
				
				var uriBase = endpoint + 'vision/v2.0/analyze';

				// Request parameters.
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

				var description;
				var found;
				
				request.post(options, (error, response, body) => {
				  if (error) {
				    console.log('Error: ', error);
				    return;
				  }

				  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');

				  var tags=JSON.parse(body)['tags'];
				  var hi_conf_objects = tags.filter(tag => tag.confidence > .8).map(tag=>tag.name);
				  console.log(hi_conf_objects);

				  var description = JSON.parse(body)['description']['captions'][0].text;

				  if(hi_conf_objects.includes('person') || true){
				  		console.log("Found a " + this.search_item);
			  			this.nav.autobots_stop();
			  			this.finale();
				  }

				});

				// console.log("PRINTING");
				// console.log(this.description);
				// console.log(this.found);
			}
			x += 1;

		});

	}

	actiavteGM(){
		this.godmode.godControl();
		this.godmodeOn=true;
		// this.nav.autobots_stop();
	}

	finale(){
		console.log('Done!');
	}

}

module.exports = MLE;
// export default MLE;