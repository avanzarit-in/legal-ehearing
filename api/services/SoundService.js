// api/services/SoundService.js

const globly = require('globly');
module.exports = {
	
	/**
	* `SoundService.list`
	*/
	list: function (client,params,callback) {
		
		client.list_sounds(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `SoundService.get`
	*/
	get: function (client,params,callback) {
		
		client.get_sounds(params, function (status, response) {
			
			callback(null,response);
			
		});
	}
};

