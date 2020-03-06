/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 const globly = require('globly');
 const os = require('os');
 const uaObj = require('useragent');

module.exports = {

   	/**
    * Login an User to eHearing
	* UserController.login
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/User/login
	*
	*/
	
	login: function (req, res) {

		sails.log.info('UserController: Method Login - User ' + req.param('username') + ' Phone Number ' + req.param('place') + ' trying to log in');

		// Get the user details from the req object for validation
		//

		var username = req.param('username');
		var userpwd = req.param('password');
		var phone = req.param('place');

		req.session.username = username;
		req.session.password = userpwd;
		req.session.place = phone;
		req.session.phone = phone;

		// Check the credentials for access
		//

		var find_params = {
			'user_name': username,
			'password': userpwd
		};

		UserService.login(find_params,function(status,user){
			
			if(status==="Success") {

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Login Succeeded',
					'userName': username,
					'first_name': user.first_name,
					'last_name': user.last_name,
					'location': user.site_location,
					'role': user.role_id,
					'tenant_id': user.tenant_id,
					'user_id': user.id,
				}
				
				req.session.user_id = user.id;
				req.session.tenant_id = user.tenant_id;
				req.session.site_id = user.site_id;

				var session_params = {
					'tenant_id': user.tenant_id,
					'user_id': user.id,
					'phone': phone,
					'action': 'Login'
				}
			
				// Save session in database
				//
				
				UserService.saveSession(req,session_params);

				return res.status(200).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Login Failed',
					'userName': username,
					'role': '1'
				}

				return res.status(404).send(res_params);
			}

		});

	},

	/**
    * Logout an User from eHearing
	* UserController.logout
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/User/logout
	*
	*/

	logout: function (req, res) {

		var session_params = {
			'tenant_id': req.session.tenant_id,
			'user_id': req.session.user_id,
			'phone': req.session.phone,
			'action': 'Logout'
		}
	
		// Save session in database
		//
		
		UserService.saveSession(req,session_params);

		var res_params = {
			'statusCode': '200',
			'statusMessage': 'Logout Succeeded'
		}

		req.session.destroy();
		res.clearCookie('sails.sid');
		
		return res.status(200).send(res_params);

	},

	/**
    * Makes an User Ready
	* UserController.ready
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/User/ready
	*
	*/

	ready: function (req, res) {

		var session_params = {
			'tenant_id': req.session.tenant_id,
			'user_id': req.session.user_id,
			'phone': req.session.phone,
			'action': 'Ready'
		}
	
		// Save session in database
		//
		
		UserService.saveSession(req,session_params);

		var res_params = {
			'statusCode': '200',
			'statusMessage': 'Ready Succeeded'
		}

		var socket_params = {
			'event': 'Device',
			'userStatus': 'Ready',
			'phone': req.session.phone,
			'user_id': req.session.username
		};

		//sails.log.info(socket_params);

		sails.sockets.broadcast(req.session.username,'devices', socket_params);

		return res.status(200).send(res_params);

	},

	/**
    * Makes an User Not Ready
	* UserController.notready
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/User/notready
	*
	*/

	notready: function (req, res) {

		var session_params = {
			'tenant_id': req.session.tenant_id,
			'user_id': req.session.user_id,
			'phone': req.session.phone,
			'action': 'Not Ready'
		}
	
		// Save session in database
		//
		
		UserService.saveSession(req,session_params);

		var res_params = {
			'statusCode': '200',
			'statusMessage': 'Not Ready Succeeded'
		}

		var socket_params = {
			'event': 'Device',
			'userStatus': 'NotReady',
			'phone': req.session.phone,
			'user_id': req.session.username
		};
		//sails.log.info(socket_params);

		sails.sockets.broadcast(req.session.username,'devices', socket_params);

		return res.status(200).send(res_params);
		
	},

	

};

