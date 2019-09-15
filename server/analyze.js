'use strict';
const language = require('@google-cloud/language');
const request = require('request');

//////////////////////////////////
/// Analysis of Image and Text ///
//////////////////////////////////

class Analyzer{

	constructor(){
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


	analyzeImage(data){

		var search_item = 'bottle';

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
		  		console.log("Found a " + search_item);
		  		return true;
		  } else return false;

		}); 
	}

}

module.exports = Analyzer;
