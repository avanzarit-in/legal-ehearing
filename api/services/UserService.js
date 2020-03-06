/**
 * UserService
 *
 * @description :: User Service to handle user login logout and other functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

const globly = require('globly');

module.exports = {

	/**
    * Login an User to eHearing
	* UserService.login
	*
	*/

	login: function (params, callback) {

		VwUserModel.find(params).exec(function (err, user) {

			if(user!==undefined && user!==null){
				
				callback("Success",user[0]);

			}
			else {

				callback("Failed",null);
			}

		});
		
	},

	/**
    * Save user session
	* UserService.saveSession
	*
	*/

	saveSession: function (req,session_params) {

		MiscService.getSessionInfo(req,function(status,response){

			session_params.host = response.host;
			session_params.browser = response.browser;
			session_params.sessionid = response.sessionid;

			TblUserSessionModel.create(session_params).exec(function (err, session) {

				if(err){
					sails.log.error('TLB_USERSESSION: Unable to save session info');
				}
				else {
					sails.log.info('TLB_USERSESSION: Succesfully saved session info');
				}
			
			});
			
		});

		
	}
	
};
