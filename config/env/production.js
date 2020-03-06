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
    connection: 'dars_db'
  },

  API_KEY:'dars',
  API_SECRET:'dars',

  // Media Server
  //  

  MEDIASRV_IP: '10.41.8.80',
  MEDIASRV_PORT: '8088',
  MEDIASRV_BASEURL: 'ari',

  // Genesys Server
  //
  EXT_SIP_TRUNK: 'cisco_outbound',

  DIAL_PREFIX: '61',

  BUSINESS_DATA: 'docket_number,site_location,issue_id,claim_type_cd,claim_type_desc',

  CALLER_ID: '8007328212',

  // Genesys Web Services and Applications
  //   

  GWS_IPADDRESS:'10.41.6.192',
  GWS_PORT:'8090',
  GWS_BASEURL: 'api/v2',

  // DEO Connect
  CONNECT_KEY:'DARSv1ConSvc',
  CONNECT_SECRET:'uPP5XTD99H+e',

  DARSCONNECT_IP: '10.41.7.15',
  DARSCONNECT_PORT: '9010',
  DARSCONNECT_BASEURL: 'DARSGenesysGateway.svc',
  
  // DEO CALL REC SSH
  SSH_HOST: '10.41.8.87',
  SSH_PORT: 22,
  SSH_USER: 'root',
  SSH_PASSWORD: 'IVRconnect1',
 
  // DEO FILENET LOCATION
  //
  FILENET_LOC: '/DarsToFilenet/',
  FILENET_STAGING_LOC: '/DarsToFilenet/temp/'
  
  
};
