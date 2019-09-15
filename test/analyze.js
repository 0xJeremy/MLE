'use strict';
const language = require('@google-cloud/language');
const request = require('request');

//////////////////////////////////
/// Analysis of Image and Text ///
//////////////////////////////////

class Analyzer{

	constructor(tmpCallback){
		this.found = false;
		this.description = '';
		this.tmpCallback = tmpCallback;
	}

	async textAnalysis(data){

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


	analyzeImage(data, item){

		var search_item = item;

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

		  this.description = JSON.parse(body)['description']['captions'][0].text;

		  this.found = true;

		  this.tmpCallback(this.description, this.found);

		  if(hi_conf_objects.includes(search_item)){
		  		console.log("Found a " + search_item);
		  		found = true;
		  }
		});
		
	}

}

module.exports = Analyzer;
