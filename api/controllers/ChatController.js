/**
 * ChatController
 *
 * @description :: Server-side logic for managing SMS or Chat Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
    * Get all chat messages
	* ChatController.getAllChat
	* 
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Chat/
	*
	*/
	
	getAllChat: function (req, res) {
		

	},

	/**
    * Get chat message between users
	* ChatController.getChat
	* 
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Chat/{other_user}
	*
	*/
	
	getChat: function (req, res) {
		

	},

	/**
    * Send chat message to a user
	* ChatController.send
	* 
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Chat/{other_user}
	*
	*/
	
	send: function (req, res) {
		

	},

	/**
    * Send chat message to all users
	* ChatController.broadcast
	* 
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Chat/
	*
	*/
	
	broadcast: function (req, res) {
		

	}

	

};

