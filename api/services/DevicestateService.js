// api/services/DevicestateService.js

const globly = require('globly');

module.exports = {
	
  /**
   * `DevicestateService.list()`
   */
	list: function (client,params, callback) {
    
		client.list_devicestates(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `DevicestateService.get()`
	*/
	get: function (client,params, callback) {
    
		client.get_devicestates(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `DevicestateService.update()`
	*/
	update: function (client,params, callback) {
    
		client.update_devicestates(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `DevicestateService.destroy()`
	*/
	destroy: function (client,params, callback) {
		
		client.delete_devicestates(params, function (status, response) {
			
			callback(null,response);
			
		});
	}
};

