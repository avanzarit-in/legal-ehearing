// api/services/ApplicationService.js

const globly = require('globly');
		  
module.exports = {
	
	list: function(client,params, callback) {
		
		client.list_all_applications(params, function (status, response) {
			
			callback(null,response);
			
		});
	
	},
		  
			  
	get: function(client,params, callback) {
		
		client.get_application(params, function (status, response) {
			
			callback(null,response);
			
		});
		
	},
		  
		 
	subscribe: function(client,params, callback) {
	  
		
		client.subscribe_application(params, function (status, response) {
			
			callback(null,response);
			
		});
		
	},
		  
	unsubscribe: function(client,params, callback) {
	  
		gclient.unsubscribe_application(params, function (status, response) {
			
			callback(null,response);
			
		});
	  
	}
		  
		  
};
