// api/services/PlaybackService.js

const globly = require('globly');
module.exports = {
	
	/**
	* `PlaybackService.get`
	*/
	get: function (client,params,callback) {
		
		client.get_playbacks(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `PlaybackService.stop()`
	*/
	stop: function (client,params,callback) {
    
		client.stop_playbacks(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `PlaybackService.control()`
	*/
	control: function (client,params,callback) {
    
		client.control_playbacks(params, function (status, response) {
			
			callback(null,response);
			
		});
	}
};

