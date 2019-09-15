'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('FireEye');

var socket = new FireEye('127.0.0.1');

console.log("FireEye address " + socket.getAddress() + " port " + socket.getPort());

var app = express();

//////////////////
/// PARAMETERS ///
//////////////////

const PORT = process.env.PORT || 5000

var server = app.listen(PORT, function() { console.log("Webpage on port " + PORT)});
var io = require('socket.io').listen(server);

///////////////////////
/// EXPRESS HEADERS ///
///////////////////////

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

///////////////////////////
/// FRONT-END ENDPOINTS ///
///////////////////////////

app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.render('./index.html');
});


var search_item = "unknown";

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

	});

});


async function textAnalysis(data){

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



var x = 0;

function analyzeImage(data){

	let subscriptionKey = process.env['AZURE_KEY'];
	let endpoint = process.env['AZURE_ENDPOINT'];
	if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }
	
	var uriBase = endpoint + 'vision/v2.0/analyze';

	// const imageUrl =
	//     'https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';

	// Request parameters.
	const params = {
	    'visualFeatures': 'Description,Tags',
	    'details': '',
	    'language': 'en'
	};

	var buf = Buffer.from(data, 'base64');
	// console.log("hi");
	// console.log(buf);

	const options = {
	    uri: uriBase,
	    qs: params,
	    body: buf,
	    headers: {
	        'Content-Type': 'application/octet-stream',
	        'Ocp-Apim-Subscription-Key' : subscriptionKey
	    }
	};

	// console.log(buf.toString());
	console.log("Image sent");
	request.post(options, (error, response, body) => {
	  if (error) {
	    console.log('Error: ', error);
	    return;
	  }

	  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
	  console.log('JSON Response\n');
	  console.log(jsonResponse);

	  var tags=JSON.parse(body)['tags'];
	  var hi_conf_objects = tags.filter(tag => tag.confidence > .8).map(tag=>tag.name);

	  console.log(hi_conf_objects);
	  if(hi_conf_objects.includes(search_item)){
	  		console.log("Found a person");
	  };

	}); 
}

socket.on('image', (data) => {
 	io.emit('image', data);
	x = x+ 1;
 	if(x % 10 == 0){
		analyzeImage(data); 	
	}

});

//////////////////////////
/// Robot Instructions ///
//////////////////////////


///////////////
/// Manual  ///
///////////////

const GenRobotInstruct = require("./genRobotInstructions.js")

io.on('connection', (ioSocket) => {
	ioSocket.on('manual', (data) => {

		var direction = data['direction'];
		var duration = data['time']; //default 1s
		var speed = data['speed']; //default 50% speed

		var instruct;
		switch(direction) {
			case 'FORWARD':
				instruct = GenRobotInstruct.genForward(speed, duration);
				break;

			case 'BACK':
				instruct = GenRobotInstruct.genBack(speed, duration);
				break;

			case 'LEFT':
				instruct = GenRobotInstruct.genForward(speed, duration);
				break;

			case 'RIGHT':
				instruct = GenRobotInstruct.genForward(speed, duration);
				break;

			default:
				console.error('Invalid manual command sent to server!\n');
		}

		if(instruct) socket.emit('instructions', instruct);

	};
}






