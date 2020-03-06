/**
 * RecordingController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
    * Start Recording a conference
	* RecordingController.recordConference
	* This controller starts recording a conference
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Conference/{conference_sid}/Record/
	*/
	
	recordConference: function (req, res) {
		

	},

	/**
    * Start Recording a channel
	* RecordingController.recordChannel
	* This controller starts recording a conference
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Channel/{participants_sid}/Record/
	*/
	
	recordChannel: function (req, res) {
		

	},
	
	/**
    * List Completed Recording
	* RecordingController.listStored
	* This controller lists all completed recording
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Recordings/stored
	*/
	
	listStored: function (req, res) {
		

	},

	/**
    * List a particular completed Recording
	* RecordingController.getStored
	* This controller lists a particular completed recording
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Recordings/stored/{recording_name}
	*/
	
	getStored: function (req, res) {
		

	},

	/**
    * Delete a particular stored Recording
	* RecordingController.deleteStored
	* This controller deletes a stored recording
	* DELETE https://api.ehearing.com/v1/Account/{auth_id}/Recordings/stored/{recording_name}
	*/
	
	deleteStored: function (req, res) {
		

	},

	/**
    * Get file associated with a stored recording
	* RecordingController.getStoredFile
	* This controller gets the recorded file name of the stored recording
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Recordings/stored/{recording_name}/file
	*/
	
	getStoredFile: function (req, res) {
		

	},

	/**
    * Copy a stored recording
	* RecordingController.copyStored
	* This controller makes a copy of the stored recording
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Recordings/stored/{recording_name}/copy
	*/
	
	copyStored: function (req, res) {
		

	},

	/**
    * List Live Recording
	* RecordingController.getLive
	* This controller lists live recording
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}
	*/
	
	getLive: function (req, res) {
		

	},

	/**
    * Stop a live recording and discard it.
	* RecordingController.deleteLive
	* This controller deletes a stored recording
	* DELETE https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}
	*/
	
	deleteLive: function (req, res) {
		

	},

	/**
    * Stop a live recording and store it.
	* RecordingController.stop
	* This controller stops a live recording and store it.
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}/stop
	*/
	
	stop: function (req, res) {
		

	},

	/**
    * Pause a live recording.
	* RecordingController.pause
	* This controller pauses a live recording.
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}/pause
	*/
	
	pause: function (req, res) {
		

	},

	/**
    * Unpause a live recording.
	* RecordingController.unpause a live recording.
	* This controller unpauses a live recording.
	* DELETE https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}/pause
	*/
	
	unpause: function (req, res) {
		

	},

	/**
    * Mute a live recording.
	* RecordingController.mute
	* This controller mutes a live recording.
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}/mute
	*/
	
	mute: function (req, res) {
		

	},

	/**
    * UnMute a live recording.
	* RecordingController.unmute a live recording.
	* This controller umutes a live recording.
	* DELETE https://api.ehearing.com/v1/Account/{auth_id}/Recordings/live/{recording_name}/mute
	*/
	
	unmute: function (req, res) {
		

	}


};

