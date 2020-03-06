/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  // User Routes
  //

  'POST /v1/Account/:authid/User/login': 'UserController.login',
  'POST /v1/Account/:authid/User/logout': 'UserController.logout',
  'POST /v1/Account/:authid/User/ready': 'UserController.ready',
  'POST /v1/Account/:authid/User/notready': 'UserController.notready',
  //'POST /v1/Account/:authid/User/forcelogout': 'UserController.forceLogout',
  //'GET /v1/Account/:authid/User/userState': 'UserController.userState',

  // Hearings
  //

  'GET /v1/Account/:authid/Hearing': 'HearingController.list',
  'GET /v1/Account/:authid/Hearing/load': 'HearingController.load',
  'POST /v1/Account/:authid/Hearing/Search': 'HearingController.search',
  'GET /v1/Account/:authid/Hearing/reload': 'HearingController.reload',
  'POST /v1/Account/:authid/Hearing/add': 'HearingController.add',
  'POST /v1/Account/:authid/Hearing/Party/add': 'HearingController.addParty',
  'POST /v1/Account/:authid/Hearing/Party/remove': 'HearingController.removeParty',

  // Conference
  //

  'POST /v1/Account/:authid/Conference': 'ConferenceController.create',
  'POST /v1/Account/:authid/Conference/start': 'ConferenceController.start_hearing',
  'GET /v1/Account/:authid/Conference': 'ConferenceController.list',
  'GET /v1/Account/:authid/Conference/:conference_sid': 'ConferenceController.get',
  'DELETE /v1/Account/:authid/Conference/:conference_sid': 'ConferenceController.end_hearing',
  'DELETE /v1/Account/:authid/Conference': 'ConferenceController.hangup_all',
  'POST /v1/Account/:authid/Conference/addDisposition': 'ConferenceController.addDisposition',
  'POST /v1/Account/:authid/Conference/addNotes': 'ConferenceController.addNotes',
  'POST /v1/Account/:authid/Conference/addRecTag': 'ConferenceController.addRecTag',

  // Music on Hold & Playback

  'POST /v1/Account/:authid/Conference/:conference_sid/moh': 'ConferenceController.start_moh',
  'DELETE /v1/Account/:authid/Conference/:conference_sid/moh': 'ConferenceController.stop_moh',

  // Conference Member

  'GET /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/get': 'ConferenceController.get_member',
  'POST /v1/Account/:authid/Conference/Member/add': 'ConferenceController.add_member',
  'POST /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/join': 'ConferenceController.join_conference',
  'POST /v1/Account/:authid/Conference/Member/hangup': 'ConferenceController.hangup_member',
  'POST /v1/Account/:authid/Conference/Member/hangup_all': 'ConferenceController.hangup_all_member',
  'POST /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/moh': 'ConferenceController.start_moh_member',
  'DELETE /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/moh': 'ConferenceController.stop_moh_member',
  'POST /v1/Account/:authid/Conference/Member/hold': 'ConferenceController.hold_member',
  'DELETE /v1/Account/:authid/Conference/Member/hold': 'ConferenceController.unhold_member',
  'POST /v1/Account/:authid/Conference/Member/hold_all': 'ConferenceController.hold_all_member',
  'DELETE /v1/Account/:authid/Conference/Member/hold_all': 'ConferenceController.unhold_all_member',
  'POST /v1/Account/:authid/Conference/Member/mute': 'ConferenceController.mute_member',
  'DELETE /v1/Account/:authid/Conference/Member/mute': 'ConferenceController.unmute_member',
  'POST /v1/Account/:authid/Conference/Member/mute_all': 'ConferenceController.muteall_member',
  'DELETE /v1/Account/:authid/Conference/Member/mute_all': 'ConferenceController.unmuteall_member',
  'POST /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/deaf': 'ConferenceController.deaf_member',
  'DELETE /v1/Account/:authid/Conference/:conference_sid/Member/:participant_sid/deaf': 'ConferenceController.undeaf_member',
  'POST /v1/Account/:authid/Conference/Member/:participant_sid/dtmf': 'ConferenceController.sendDTMF',


  // Statistics
  //

  'GET /v1/Account/:authid/Analytic/adherence': 'ReportController.adherence',
  'GET /v1/Account/:authid/Analytic/statAvg': 'ReportController.statAvg',
  //'GET /v1/Account/:authid/Report/role/supervisor': 'UserController.supervisor',

  // Local Recording
  'POST /v1/Account/:authid/Recording/copy': 'RecordingController.copyRecording',
  'POST /v1/Account/:authid/Recording/convert': 'RecordingController.convert',
  'POST /v1/Account/:authid/Recording/interfaceFile': 'RecordingController.interfaceFile',

  // Socket

  'GET /v1/Account/:authid/Socket/getId': 'SocketController.getId',
  'POST /v1/Account/:authid/Socket/join': 'SocketController.join',
  'POST /v1/Account/:authid/Socket/leave': 'SocketController.leave',
  'GET /v1/Account/:authid/Socket/getRoomsList': 'SocketController.getRoomsList',

  // Disposition Code
  //

  'GET /v1/Account/:authid/Disposition/dispCode': 'ConfigController.getDispCode',
  'POST /v1/Account/:authid/Disposition/dispCode': 'ConfigController.setDispCode'

};
