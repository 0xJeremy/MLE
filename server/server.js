'use strict';
const language = require('@google-cloud/language');
const request = require('request');
const express = require('express');
const FireEye = require('fireeye');
var ip = require('ip');
const MLE = require('./MLE.js');

var socket1 = new FireEye(ip.address(), 8080);
var socket2 = new FireEye(ip.address(), 9090);

console.log("FireEye address " + socket1.getAddress() + " port " + socket1.getPort());
console.log("FireEye address " + socket2.getAddress() + " port " + socket2.getPort());

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


socket1.on('test', data=>{
	console.log(data);
});

app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.render('./index.html');
});

var bot1 = new MLE(io, socket1, 1);
var bot2 = new MLE(io, socket2, 2);
