// api/services/CronService.js

const globly = require('globly');
const os = require('os');
const moment = require('moment');

module.exports = {

	
	wsMediaServer: function () {

		var instance_id = process.env.NODE_APP_INSTANCE;

		if(instance_id==='0'){

			sails.log.info('wsMediaServer - Instance ID: ' + instance_id);
	
			var osJson = os.networkInterfaces();

			var ipAddress = osJson.eth0[0].address;

			TblWssessionModel.find({ipaddress:ipAddress}).exec(function(err,wsSession) {

				if(err){
					
					sails.log.info('Error in retrieving Websocket status from the database');

					//WebsocketService.openSocket();
				}
				else {

					if(wsSession!==undefined && wsSession.length > 0){

						var wsStatus = wsSession[0].status;

						sails.log.info('Websocket connection is active in the database.');
					}
					else {

						WebsocketService.openSocket();

					}
					

				}
			});

			
		}

	}

};
