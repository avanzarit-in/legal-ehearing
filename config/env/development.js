/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }
  
  hookTimeout: 40000,
  models: {
    connection: 'ehearing_db'
  },

  API_KEY:'dars',
  API_SECRET:'dars',

  // Media Server
  //  

  MEDIASRV_IP: '10.0.0.12',
  MEDIASRV_PORT: '8088',
  MEDIASRV_BASEURL: 'ari',
  MEDIASRV_SSH_PORT: 22,
  MEDIASRV_SSH_USER: 'root',
  MEDIASRV_SSH_PASSWORD: 'Bimmer13!',

  // Genesys Server
  //
  EXT_SIP_TRUNK: 'ehearing_twilio',

  DIAL_PREFIX: '+1',

  BUSINESS_DATA: 'docket_number,site_location,issue_id,claim_type_cd,claim_type_desc',

  CALLER_ID: '19093031008',

  // Local Recording
  //

  RECORD_ALL_CALLS: 'true',
  RECORD_LOCAL_DIR: '/recording/',
  RECORD_FORMAT: 'mp3',
  RECORD_BITRATE: '16',
  RECORD_REMOTE_DIR: '/var/spool/asterisk/recording/',

  // Application Log File Settings
  //   

  LOG_TO_FILE: 'false',
  LOG_FILE_LOC: '/logs/ehearing',
  LOG_FILE_EXTN: '.log',

  EVENTLOG_FILE_NAME: 'EVENTS',
  USERLOG_FILE_NAME: 'USERSESSION',
  //ZOOM_XFER_LOG: 'ZOOMXFER',
  //ZOOM_AUDIO_LOG: 'ZOOMAUDIO',
  //GENESYSLOG_FILE_NAME: 'GENESYS'
};
