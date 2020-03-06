/**
 * Cron Job Settings
 * 
 *
 * Configuration for running cron in Sails.
 *
 */

const moment = require('moment');

module.exports.cron = {
    
   wsMediaServer: {

       schedule: '*/60 * * * * *',
       onTick: function () {

       CronService.wsMediaServer();

       }
    }


};
