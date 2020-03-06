// api/services/MailboxService.js

const globly = require('globly');

module.exports = {
	
	/**
	* `MailboxService.list()`
	*/
	list: function (client,params, callback) {
		
		client.list_mailboxes(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `MailboxService.get()`
	*/
	get: function (client,params, callback) {
		
		client.get_mailboxes(params, function (status, response) {
			
			callback(null,response);
			
		});
		
	},


	/**
	* `MailboxService.update()`
	*/
	update: function (client,params, callback) {
    		
		client.update_mailboxes(params, function (status, response) {
			
			callback(null,response);
			
		});
	},


	/**
	* `MailboxService.delete()`
	*/
   
	delete: function (client,params, callback) {
    
		client.destroy_mailboxes(params, function (status, response) {
			
			callback(null,response);
			
		});
	}
};

