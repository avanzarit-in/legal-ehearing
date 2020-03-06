/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

  // level: 'info'
'use strict';
var winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = '/logs/ehearing';

// Create the log directory if it does not exist
 if (!fs.existsSync(logDir)) {
   fs.mkdirSync(logDir);
 }

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [ 
  // colorize the output to the console
  new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-eHearingLog.log`,
      timestamp: tsFormat,
      datePattern: 'MMddyyyy',
      prepend: true,
      json: false,
      level: 'info'
    })
  ]
});

 module.exports.log = {
// Pass in our custom logger, and pass all log levels through.
  custom: logger,
  level: 'silly',
  inspect: false
 };
