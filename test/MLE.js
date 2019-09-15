'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('FireEye');
const Analyzer = require('./analyze.js');
const RobotNav = require('./navControl.js');


class MLE{
	constructor(io, socket){
		this.socket = socket;
		this.io = io;

		this.analyzer = new Analyzer();
		this.search_item;
		this.nav = new RobotNav(socket);
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

				if(JSON.parse(data)['response']){
					this.nav.autobots_rollout();
					console.log('Rollout!!!');

				}
				// }
				// var CURR_STATE = STATES.STOPPED;

			});

		});
	}

	beginSearch(){

		// this.nav.autobots_rollout();
		var x = 0;
		this.socket.on('image', (data) => {
		 	this.io.emit('image', data);
			
		 	if(x == 0){
				this.analyzer.analyzeImage(data); 	
			}
			x = 1;

		});

	}
}

module.exports = MLE;
// export default MLE;