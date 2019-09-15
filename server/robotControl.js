'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('FireEye');



const robotControl = {
	search_item: "unknown";

	STATES: {
			STOPPED: 'Stopped',
			SEARCHING: 'Searching',
			BACKTRACKING: 'Backtracking',
			FOUND: 'Found'
		}

	var CURR_STATE;

	io.on('connection', (ioSocket) => {

		// Find item to search for
		ioSocket.on('search', (data) => {
			console.log(data);

			textAnalysis(data)
				.then(item => {

					console.log(item);
					search_item = item;
					ioSocket.emit('search_item',item);
				})
				.catch(console.error);
		});

		ioSocket.on('confirmed_search', (data) => {
			// Run the search!!!
			var CURR_STATE = STATES.STOPPED;
			autobots_rollout();

		});

	});
}