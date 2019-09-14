'use strict';

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

var test = 0;

socket.on('image', (data) => {
 	io.emit('image', data);


 	if (x=0){
	 	let subscriptionKey = process.env['COMPUTER_VISION_SUBSCRIPTION_KEY'];
	 	let endpoint = process.env['COMPUTER_VISION_ENDPOINT']
	 	if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

	 	var uriBase = endpoint + 'vision/v2.0/analyze';

	 	const imageUrl =
	 	    'https://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';

	 	// Request parameters.
	 	const params = {
	 	    'visualFeatures': 'Categories,Description,Color',
	 	    'details': '',
	 	    'language': 'en'
	 	};

	 	const options = {
	 	    uri: uriBase,
	 	    qs: params,
	 	    body: '{"url": ' + '"' + imageUrl + '"}',
	 	    headers: {
	 	        'Content-Type': 'application/json',
	 	        'Ocp-Apim-Subscription-Key' : subscriptionKey
	 	    }
	 	};

	 	request.post(options, (error, response, body) => {
	 	  if (error) {
	 	    console.log('Error: ', error);
	 	    return;
	 	  }
	 	  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
	 	  console.log('JSON Response\n');
	 	  console.log(jsonResponse);
	 	});
	 }

});
