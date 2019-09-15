'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('fireeye');
const GenRobotInstruct = require('./genRobotInstructions.js');

// console.log("FireEye address " + socket.getAddress() + " port " + socket.getPort());


class RobotNav {

	constructor(socket){
		this.robot_socket = socket;

		this.STATES = {
			STOPPED: 'Stopped',
			SEARCHING: 'Searching',
			BACKTRACKING: 'Backtracking',
			FOUND: 'Found'
		}

		this.CURR_STATE = this.STATES.STOPPED;

		this.error = false;

		this.command_queue = [];

	}

	autobots_rollout(){
		if(this.CURR_STATE != this.STATES.STOPPED){
			// socket.emit('instructions',GenRobotInstruct.genStop());
			this.CURR_STATE = this.STATES.STOPPED;
		}

		var i = 0;
		while(i < 1 && !this.error){
			this.autobots_search();
			i++;
		}
	}

	autobots_run(){

		var com = this.command_queue.pop();

		if(!com) return;

		if(this.error) return;

		const wait = 1000 * JSON.parse(com)['time'];
		console.log(wait);
		console.log(com);
		this.robot_socket.write('instructions',com);

		setTimeout(()=>this.autobots_run(), wait);
		return;
	}


	autobots_stop(){
		console.log(this.robot_socket);
		this.robot_socket.write('instructions', GenRobotInstruct.genStop());
		this.command_queue = [];
		this.CURR_STATE = this.STATES.STOPPED;
	}

	autobots_search(){

		this.CURR_STATE = this.STATES.SEARCHING;
		const speed = 25;
		const duration = 4

	 	this.command_queue.push(GenRobotInstruct.genForward(speed, duration), // Move forward
	 										GenRobotInstruct.genLeft(-speed, duration), // Center
	 										GenRobotInstruct.genRight(speed,duration), // Look right
	 										GenRobotInstruct.genRight(speed, duration), // Center
	 										GenRobotInstruct.genLeft(-speed, duration), //Look left
	 										);
	 	this.autobots_run();
	}

	autobots_backtrack(){
		const speed = 25;
		const duration = 4;

		this.command_queue.push(GenRobotInstruct.genBack(-speed, 2));
	}
}

module.exports = RobotNav;
