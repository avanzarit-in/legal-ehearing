// api/services/EndpointService.js

const globly = require('globly');
module.exports = {
	


	/**
	* `EndpointService.list()`
	*/
	list: function (client,params, callback) {
    
		client.list_endpoints(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `EndpointService.sendMessage()`
	*/
	sendMessage: function (client,params, callback) {
    
		client.send_message_endpoints(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `EndpointService.listByTech()`
	*/
	listByTech: function (client,params, callback) {
		
		client.list_tech_endpoints(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `EndpointService.get()`
	*/
	get: function (client,params, callback) {
		
		client.get_endpoints(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `EndpointService.sendMessageToEndpoint()`
	*/
	sendMessageToEndpoint: function (client,params, callback) {
    
		client.message_resource_endpoints(params, function (status, response) {
			
			callback(null,response);
			
		});
	}
};

