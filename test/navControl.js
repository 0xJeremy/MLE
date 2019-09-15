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
		this.runDone = false;

	}

	autobots_rollout(){
		if(this.CURR_STATE != this.STATES.STOPPED){
			// socket.emit('instructions',GenRobotInstruct.genStop());
			this.autobots_stop();
		}
		this.autobots_search();

	}

	autobots_run(){

		var com = this.command_queue.pop();

		if(!com) return true;

		if(this.error) return 0;

		const wait = 1000 * JSON.parse(com)['time'];
		console.log(wait);
		console.log(com);
		this.robot_socket.write('instructions',com);

		setTimeout(()=>this.autobots_run(), wait);
	}


	autobots_stop(){
		this.robot_socket.write('instructions', GenRobotInstruct.genStop());
		this.command_queue = [];
		this.CURR_STATE = this.STATES.STOPPED;
	}

	autobots_search(){

		this.CURR_STATE = this.STATES.SEARCHING;
		const speed = 25;
		const duration = 4

		var new_instruct = Math.floor(Math.random() * Math.floor(4));

		switch(new_instruct){
			case 0:
				this.command_queue.push(GenRobotInstruct.genLeft(speed, duration));
				break;
			case 1:
				this.command_queue.push(GenRobotInstruct.genRight(speed, duration));
				break;

			case 2:
				this.command_queue.push(GenRobotInstruct.genForward(speed, duration));
				break;

			case 3:
				this.command_queue.push(GenRobotInstruct.genBack(speed, duration));
				break;

			default:
			 	this.command_queue.push(GenRobotInstruct.genForward(speed, duration), // Move forward
			 										GenRobotInstruct.genLeft(-speed, duration), // Center
			 										GenRobotInstruct.genRight(speed,duration), // Look right
			 										GenRobotInstruct.genRight(speed, duration), // Center
			 										GenRobotInstruct.genLeft(-speed, duration), //Look left
			 										);
			 	break;
		}
	 	this.autobots_run();
	}

	autobots_backtrack(){
		const speed = 25;
		const duration = 4;

		this.command_queue.push(GenRobotInstruct.genBack(-speed, 2));
	}
}

module.exports = RobotNav;
