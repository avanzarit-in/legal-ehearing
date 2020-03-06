// api/services/LoggingService.js

const globly = require('globly');
const genesys = require('genesys');

const moment = require('moment');
const os = require('os');

module.exports = {

	/**
	* `LoggingService.saveEventsToFile()`
	* 
    */

	saveEventsToFile: function(event_params) {

		const fs = require('fs');

		var location = sails.config.LOG_FILE_LOC + '/';

		var fileName = sails.config.EVENTLOG_FILE_NAME;
		var fileExtension = sails.config.LOG_FILE_EXTN;

		var timeStamp = moment(new Date()).format('MM-DD-YYYY h:mm:ss A');

		var filePath = location + fileName + '_' + moment(new Date()).format('MMDDYYYY') + fileExtension;		

		var fileStr = timeStamp + '|' + event_params['user_id'] + '|' + event_params['event_type'] + '\r\n\n' + event_params['event_body'] + '\r\n\n';

		//EVENTS_03152018.log

		// add a line to a events log file, using appendFile

		//sails.log.info(fileStr);

		fs.appendFileSync(filePath, fileStr, function (err) {

			if (!err) {

				sails.log.info('Events Log File Updated!');
			}
			else {

				sails.log.info('Events Log File Update Failed!');

			}

		});
	},
	saveUserSessToFile: function(user_params) {

		const fs = require('fs');

		var location = sails.config.LOG_FILE_LOC + '/';

		var fileName = sails.config.USERLOG_FILE_NAME;
		var fileExtension = sails.config.LOG_FILE_EXTN;

		var timeStamp = moment(new Date()).format('MM-DD-YYYY h:mm:ss A');

		var filePath = location + fileName + '_' + moment(new Date()).format('MMDDYYYY') + fileExtension;		

		var fileStr = timeStamp + '|' + user_params['username'] + '|' + user_params['place'] + '|' + user_params['state'] + '\r\n\n' + '\thost:' + user_params['host'] + '\r\n' + '\tbrowser:' + user_params['browser'] + '\r\n' + '\tsessionid:' + user_params['sessionid'] + '\r\n\n';

		//EVENTS_03152018.log

		// add a line to a events log file, using appendFile

		//sails.log.info(fileStr);

		fs.appendFileSync(filePath, fileStr, function (err) {

			if (!err) {

				sails.log.info('User Session File Updated!');
			}
			else {

				sails.log.info('User Session File Update Failed!');

			}

		});
	},
	logToFile: function(file_params) {

		const fs = require('fs');

		var location = sails.config.LOG_FILE_LOC + '/';

		var fileName = file_params['logFileName'];
		var fileExtension = sails.config.LOG_FILE_EXTN;

		var timeStamp = moment(new Date()).format('MM-DD-YYYY h:mm:ss A');

		var filePath = location + fileName + '_' + moment(new Date()).format('MMDDYYYY') + fileExtension;		

		//var fileStr = timeStamp + '|' + user_params['username'] + '|' + user_params['place'] + '|' + user_params['state'] + '\r\n\n' + '\thost:' + user_params['host'] + '\r\n' + '\tbrowser:' + user_params['browser'] + '\r\n' + '\tsessionid:' + user_params['sessionid'] + '\r\n\n';

		var fileStr = timeStamp + '|' + file_params['logRecord'];

		//fileName_03152018.log

		// add a line to a events log file, using appendFile

		//sails.log.info(fileStr);

		fs.appendFileSync(filePath, fileStr, function (err) {

			if (!err) {

				sails.log.info('Log File Updated!');
			}
			else {

				sails.log.info('Log File Update Failed!');

			}

		});
	},
};
