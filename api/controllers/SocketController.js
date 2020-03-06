/**
 * SocketController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  	/**
    * Get Socket Id
	* SocketController.getId
	*
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Socket/getId
	*
	*/

	getId: function (req, res) {

		var socketId = sails.sockets.getId(req.socket);

		sails.log.info('My socket ID is: ' + socketId);

		return res.json(socketId);
	},

	/**
    * Join Room
	* SocketController.join
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Socket/join
	*
	*/

	join: function (req, res) {

		if (!req.isSocket) {
			return res.badRequest('This endpoints only supports socket requests.');
		}

		var roomName = req.param('roomName');

		sails.log.info('My Room is: ' + roomName);

		sails.sockets.join(req.socket, roomName, function (err) {

			if (err) {
				return res.serverError(err);
			}

			return res.json({
				message: 'Subscribed to a room called ' + roomName + '!'
			});

		});
	},

	/**
    * Leave Room
	* SocketController.leave
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Socket/leave
	*
	*/

	leave: function (req, res) {

		if (_.isUndefined(req.param('roomName'))) {
			return res.badRequest('`roomName` is required.');
		}

		if (!req.isSocket) {
			return res.badRequest('This endpoints only supports socket requests.');
		}

		var roomName = req.param('roomName');

		sails.sockets.leave(req, roomName, function (err) {

			if (err) {
				return res.serverError(err);
			}

			return res.json({
				message: 'Left the room called ' + roomName + '!'
			});
		});

	},


	/**
    * Get Room List
	* SocketController.getRoomsList
	*
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Socket/join
	*
	*/

	getRoomsList: function(req, res) {

		var roomNames = JSON.stringify(sails.sockets.rooms());

		res.json({
		  message: 'A list of all the rooms: ' + roomNames
		});
	}

};

