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

		this.analyzer = new Analyzer();
		this.search_item;
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

				if(JSON.parse(data)['response'] && !godmodeOn){
					this.nav.autobots_rollout();
					console.log('Rollout!!!');

				}

			});

		});
	}

	beginSearch(){

		// this.nav.autobots_rollout();
		var x = 1;
		this.socket.on('image', (data) => {
		 	this.io.emit('image', data);
			
		 	if(x == 0){
				this.analyzer.analyzeImage(data); 	
			}
			x = 1;

		});

	}
	
	activateGM(){
		this.godmode.godControl();
		this.godmodeOn=true;
		// this.nav.autobots_stop();
	}

}

module.exports = MLE;
// export default MLE;