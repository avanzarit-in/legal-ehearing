// api/services/WebsocketService.js

const globly = require('globly');
const moment = require('moment');
const os = require('os');

module.exports = {

	openSocket: function() {

		var WebSocket = require('ws');
		var events = require('events');

		var socket = new WebSocket('http://'+ sails.config.MEDIASRV_IP +':'+ sails.config.MEDIASRV_PORT + '/ari/events?app=app_dars' + '&api_key=' + sails.config.API_KEY + ':' + sails.config.API_SECRET + '&subscribeAll=true');
		
		// Add a connect listener on Open
		//

		socket.on('open',function(ws) {

			var params = {
				'statusCode': '0',
				'statusMessage': 'Connected to the server'
			};

			sails.log.info('Client has connected to the server!');

			var osJson = os.networkInterfaces();
			var ipAddress = osJson.eth0[0].address;

			var params = {
				'ipaddress': ipAddress,
				'status': 'Active'
			};

			TblWssessionModel.create(params).exec(function(err,wsSession) {

				if(err){
					
					sails.log.info('Error in storing Websocket status in database');

				}
				else {

					sails.log.info('Successfully stored Websocket status in the database');
					sails.log.info(wsSession);
				}
			});

		});

		// Add a connect listener on Error
		//

		socket.on('error',function(data) {

			var params = {
				'statusCode': '401',
				'statusMessage': 'Error Connecting to Web Socket'
			};

			sails.log.info('Error Connecting to Web Socket');

			var osJson = os.networkInterfaces();
			var ipAddress = osJson.eth0[0].address;

			TblWssessionModel.destroy({ipaddress:ipAddress}).exec(function(err,wsSession) {

				if(err){
					
					sails.log.info('Error in destroying Websocket status from the database');

				}
				else {

					sails.log.info('Successfully destroyed Websocket status from the database');
				
				}
			});

		});

		// Add an event listener on Event
		//

		socket.on('event',function(data) {
			sails.log.info('Received an event from the server!',data);
		});

		// Add an event listener on Event
		//

		socket.on('close',function(data) {

			sails.log.info('Server has closed the connection!');

			var osJson = os.networkInterfaces();
			var ipAddress = osJson.eth0[0].address;
		
			setTimeout(() => {

				TblWssessionModel.destroy({ipaddress:ipAddress}).exec(function(err,wsSession) {

					if(err){
						
						sails.log.info('Error in destroying Websocket status from the database');
	
					}
					else {
	
						sails.log.info('Successfully destroyed Websocket status from the database');
					}
				});

			}, 1000);

			
		});

		// Add a message listener on Message
		//

		socket.on('message',function(data) {

			EventService.eventActions(JSON.parse(data));

		});

		// Add a disconnect listener on disconnect
		//

		socket.on('disconnect',function() {
			sails.log.info('The client has disconnected!');

			var osJson = os.networkInterfaces();
			var ipAddress = osJson.eth0[0].address;

			TblWssessionModel.destroy({ipaddress:ipAddress}).exec(function(err,wsSession) {

				if(err){
					
					sails.log.info('Error in destroying Websocket status from the database');

				}
				else {

					sails.log.info('Successfully destroyed Websocket status from the database');
				}
			});
		});

	}
};

