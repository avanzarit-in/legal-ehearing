/**
 * MiscService
 *
 * @description :: Misc Service to handle miscellaneous functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

const os = require('os');
const uaObj = require('useragent');
const moment = require('moment');

module.exports = {

	/**
    * Get Session Info
	* MiscService.getSessionInfo
	*/

    getSessionInfo: function (req, callback) {

        var osJson = os.networkInterfaces();
		var userAgent = req.headers['user-agent'];

		var host = osJson.eth0[0].address;
		var cookie = req.headers.cookie;
		var agent = uaObj.parse(req.headers['user-agent']);
		var browser = agent.toAgent();

		var sailsSidArray={};
		var sailsSid = '';

		if(cookie!==undefined){

			sailsSidArray = cookie.split('=');

			if(sailsSidArray.length > 0){

				sailsSid = sailsSidArray[1];
			}	
        }
        
        var session_params = {
            'browser': browser,
            'host': host,
            'sessionid': sailsSid
        };

        callback("Success", session_params);

	},
	
	/**
    * Get Current Date Object
	* MiscService.getCurrentDate
	*/

	getCurrentDate: function (req, callback) {

		var currentDate = moment(new Date()).format('MM/DD/YYYY');
		var epochTime = new Date().valueOf();

		var currentYear = moment(new Date()).format('YYYY');
		var currentMonth = moment(new Date()).format('MM');
		var currentDay = moment(new Date()).format('DD');
		var currentQtr = moment(new Date()).format('Q');

		var curr_params = {
            'year': currentYear,
            'month': currentMonth,
			'day': currentDay,
			'quarter': currentQtr,
			'date': currentDate,
			'epochTime': epochTime
        };

        callback("Success", curr_params);

	}

};
