// api/services/RecordingService.js

const globly = require('globly');
const moment = require('moment');

module.exports = {

	/**
    * List Completed Recording
	* RecordingService.listStored
	*/

	listStored: function (client, params, callback) {

		client.list_stored_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Get Completed Recording
	* RecordingService.getStored
	*/

	getStored: function (client, params, callback) {

		gclient.get_stored_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Delete Completed Recording
	* RecordingService.deleteStored
	*/

	deleteStored: function (client, params, callback) {

		client.delete_stored_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Copy Completed Recording
	* RecordingService.copyStored
	*/

	copyStored: function (client, params, callback) {

		client.copy_stored_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Get Live Recording
	* RecordingService.getLive
	*/

	getLive: function (client, params, callback) {

		client.get_live_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Cancel Live Recording
	* RecordingService.cancel
	*/

	cancel: function (client, params, callback) {


		client.cancel_live_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Start Bridge Recording
	* RecordingService.recordBridge
	*/

	recordBridge: function (client, params, callback) {

		client.start_bridge_recordings(params, function (status, response) {

			callback(status, response);

		});
	},

	/**
    * Start Channel Recording
	* RecordingService.recordChannel
	*/

	recordChannel: function (client, params, callback) {

		client.start_channel_recordings(params, function (status, response) {

			callback(status, response);

		});
	},

	/**
    * Stop Recording
	* RecordingService.stop
	*/

	stop: function (client, params, callback) {

		client.stop_live_recordings(params, function (status, response) {

			callback(null, response);

		});
	},


	/**
    * Pause Recording
	* RecordingService.stop
	*/

	pause: function (client, params, callback) {
		return res.json({
			todo: 'pause() is not implemented yet!'
		});
	},


	/**
    * Resume Recording
	* RecordingService.unpause
	*/

	unpause: function (client, params, callback) {
		return res.json({
			todo: 'unpause() is not implemented yet!'
		});
	},


	/**
    * Mute Recording
	* RecordingService.mute
	*/

	mute: function (client, params, callback) {
		return res.json({
			todo: 'mute() is not implemented yet!'
		});
	},


	/**
    * Unmute Recording
	* RecordingService.unmute
	*/

	unmute: function (client, params, callback) {
		return res.json({
			todo: 'unmute() is not implemented yet!'
		});
	},

	/**
    * xfer Media Server Recording
	* RecordingService.xferMSRecFiles
	*/

	xferMSRecFiles: function (params, callback) {


	},

	/**
    * xfer Recording
	* RecordingService.xfer
	*/

	xfer: function (params, callback) {

		var sftpClient = require('ssh2').Client;

		var connSettings = {
			host: sails.config.MEDIASRV_IP,
			port: sails.config.MEDIASRV_SSH_PORT, // Normal is 22 port
			username: sails.config.MEDIASRV_SSH_USER,
			password: sails.config.MEDIASRV_SSH_PASSWORD
			// You can use a key file too, read the ssh2 documentation
	   };
		
	   sails.log.info(' In RecordingService - xfer');
	   sails.log.info(params);

		var sftpConn = new sftpClient();

		sftpConn.on('ready', function() {

			sftpConn.sftp(function (err, sftp) {

				if (err) {

					callback('Failure','Error initiating SSH2');
					
				} 
				else {

					// you'll be able to use sftp here
					// Use sftp to execute tasks like .unlink or chmod etc

					var moveFrom = sails.config.RECORD_REMOTE_DIR + params['filename']; 
					var moveTo = sails.config.RECORD_LOCAL_DIR + params['filename'];

					sftp.fastGet(moveFrom, moveTo , {}, function(downloadError){

						if(downloadError) {
						
							sails.log.info(' SFTP Error for conference_sid ' + params['conference_sid']);
							callback('Failure','Download Error');
							
						}
						else {

							sails.log.info(' SFTP Successful for conference_sid ' + params['conference_sid']);
							
							if(sails.config.RECORD_FORMAT === 'mp3') {

								var convert_params = {
									'source': moveTo,
									'target': moveTo.replace(/wav/g, sails.config.RECORD_FORMAT)
								}

								console.log(convert_params);

								RecordingService.convertAudio(convert_params, function (status, response) {

									console.log('Conversion status is ' + status + ' Response is ' + response);

								});
							}

							sftp.unlink(moveFrom, function(err){

								if ( err ) {

									sails.log.info( "Error removing file from Media Server: %s", err );
									
									callback('Success','Files Transferred');
								}
								else {

									sails.log.info( "Media Server Recording Removed" );

									callback('Success','Files Transferred and Removed');
								
								}
								
								sftpConn.end();
								
							});
							

						}
	
					});
				}
			});
		}).connect(connSettings);
	},

	/**
    * copy Recording
	* RecordingService.copyRecording
	*/

	copyRecording: function (params, callback) {



	},

	/**
    * Convert Audio
	* RecordingService.convertAudio
	*/

	convertAudio: function (params, callback) {

		var source = params['source'];
		var target = params['target'];

		var ffmpeg_params = {
			'source': source,
			'target': target,
			'format': sails.config.RECORD_FORMAT,
			'bitrate': sails.config.RECORD_BITRATE
		}

		RecordingService.ffmpegConvert(ffmpeg_params, function (status, response) {

			sails.log.info(' Conversion of ' + source + ' to ' + target + ' Result: ' + response);

			if (status === 'Success') {

				callback('Success', 'Conversion Finished');
			}
			else {
				callback('Failure', 'Conversion Failed');
			}

		});

	},

	/**
    * Call ffmpeg
	* RecordingService.ffmpegConvert
	*/

	ffmpegConvert: function (params, callback) {
		
		var ffmpeg = require('fluent-ffmpeg');
		var track = params['source'];//your path to source file

		ffmpeg(track)
			.toFormat(params['format'])
			.audioBitrate(params['bitrate'])
			.on('error', function (err) {

				sails.log.info('An error occurred: ' + err.message);

				var fileStr = params['source'] + '|' + params['target'] + '|' + err.message +'\r\n';

				var file_params = {
					'logFileName': 'LOCAL_AUDIO_TEMP',
					'logRecord': fileStr
				};
		
				//LoggingService.logToFile(file_params);

				callback('Failure', 'Conversion Failed');
			})
			.on('progress', function (progress) {
				// console.log(JSON.stringify(progress));

				//var fileStr = params['gen_connid'] + '|' + params['cplid'] + '|' + params['source'] + '|' + params['target'] + '|' + progress.targetSize + ' KB converted' +'\r\n';

				//var file_params = {
				//	'logFileName': sails.config.ZOOM_AUDIO_LOG,
				//	'logRecord': fileStr
				//};
		
				//LoggingService.logToFile(file_params);

				//sails.log.info('Processing: ' + progress.targetSize + ' KB converted');

			})
			.on('end', function () {

				var fileStr = params['source'] + '|' + params['target'] + '|' + 'Conversion Finished' + '\r\n';

				var file_params = {
					'logFileName': 'LOCAL_AUDIO_TEMP',
					'logRecord': fileStr
				};
		
				//LoggingService.logToFile(file_params);

				sails.log.info(fileStr);

				callback('Success', 'Conversion Finished');
			})
			.save(params['target']);//path where you want to save your file

	},

	/**
    * Generate Interface file
	* RecordingService.ffmpegConvert
	*/

	interfaceFile: function (params, callback) {

	}
};