// api/services/BridgeService.js

const globly = require('globly');
const moment = require('moment');

module.exports = {

	/**
   * `BridgeService.list()`
   */
	list: function (client,params, callback) {

		client.list_all_bridges(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.get()`
	*/
	get: function (client,params, callback) {

		client.get_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.create()`
	*/
	create: function (client,params, callback) {

		client.create_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.hangup`
	*/
	hangup: function (client,params, callback) {

		client.delete_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.addMember`
	*/
	addMember: function (client,params, callback) {

		var channel_params = {
			'endpoint': params['endpoint'],
			'app': params['app'],
			'appArgs': params['appArgs'],
			'callerId': params['callerId'],
			'timeout': params['timeout']
		};

		var variables = {
			'channel_detail': params['username'] + ':' + params['user_id'] + ':' + params['tenant_id'] + ':' + params['conference_sid'] + ':' + params['phone_number'] + ':' + params['role'],
			'DENOISE(rx)':'on',
			'TALK_DETECT(set)':'2000,256'
		};

		console.log(variables);

		channel_params['variables']=variables;

		delete params.app;
		delete params.appArgs;
		delete params.callerId;
		delete params.endpoint;
		delete params.username;
		

		ChannelService.originate(client,channel_params, function (status, response) {

			params.participant_sid = response.id;
			params.state = response.state;
			params.call_to = params.phone_number;

			delete params.phone_number;

			TblConferencePartyModel.create(params).exec(function(err,participant) {

				if(err) {

					sails.log.error(err);
				};
			});

			callback(status,response);

		});

	},

	/**
	* `BridgeService.addParticipant`
	*/
	addParticipant: function (client,params, callback) {

		sails.log.info('In AddParticipant');
		

		var channel_params = {
			'endpoint': params['endpoint'],
			'app': params['app'],
			'appArgs': params['appArgs'],
			'callerId': params['callerId'],
			'timeout': params['timeout']
		};

		var variables = {
			'channel_detail': params['username'] + ':' + params['user_id'] + ':' + + params['tenant_id'] + ':' + params['conference_sid'] + ':' + params['phone_number'] + ':' + params['role'] + ':' + params['announcer_sid'],
			'DENOISE(rx)':'on',
			'TALK_DETECT(set)':'2000,256'
			
		};

		channel_params['variables']=variables;

		delete params.app;
		delete params.appArgs;
		delete params.callerId;
		delete params.endpoint;
		delete params.username;
		delete params.announcer_sid;
		
		console.log(channel_params);

		ChannelService.originate(client,channel_params, function (status, response) {

			params.participant_sid = response.id;
			params.state = response.state;
			params.call_to = params.phone_number;

			delete params.phone_number;

			console.log(response);
			
			TblConferencePartyModel.create(params).exec(function(err,participant) {

				if(err) {

					sails.log.error(err);
				};
			});

			callback(status,response);

		});

	},

	/**
	* `BridgeService.addDisposition`
	*/
	addDisposition: function (params, callback) {

		sails.log.info('In addDisposition');
		

		var upd_params = {
			'disposition_code': params['code']
		};

		var query_params = {
			'user_id': params['user_id'],
			'tenant_id': params['tenant_id'],
			'conference_sid': params['conference_sid']
		};

		TblConferenceModel.update(query_params, upd_params).exec(function (err, conference) {

			if(err){

				var response_params = {
					'status': '404',
					'message': 'Failed to update disposition code'

				}

				callback('404',response_params);
			}
			else {

				var response_params = {
					'status': '200',
					'message': 'Successfully updated disposition code'

				}
				
				callback('200',response_params);
			}
		});
	},

	/**
	* `BridgeService.addChannelBridge()`
	*/
	addChannel: function (client,params, callback) {

		client.add_channel_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.removeChannel`
	*/
	removeChannel: function (client,params, callback) {

		client.remove_channel_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
   * `BridgeService.startMoh`
   */
	startMoh: function (client,params, callback) {

		client.start_moh_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.stopMoh`
	*/
	stopMoh: function (client,params, callback) {

		client.stop_moh_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.playMedia`
	*/
	playMedia: function (client,params, callback) {

		client.play_bridge(params, function (status, response) {

			callback(status,response);

		});
	},

	/**
	* `BridgeService.playMediaWithId`
	*/
	playMediaWithId: function (client,params, callback) {

		client.play_bridge_withId(params, function (status, response) {

			callback(status,response);

		});
	},
	
	/**
		* `BridgeService.xferCFILES`
	*/

	xferCFILES: function (params, callback) {

		var curr_date = new Date();
		var record_dt = moment(curr_date).format('MM/DD/YYYY');

		Conference.find(params).exec(function (err, conference) {

			if (!err && conference!=undefined && conference.length > 0) {

				var params = {};

				params = {
					'record_dt': record_dt,
					'connid': conference[0].gen_connid
				}

				//console.log(params);

				ZoomService.xferFiles(params, function (status, response) {

					var res_params;

					if (status == 'Success') {

						res_params = {
							'statusCode': '200',
							'statusMsg': 'Files Transferred Successful'
						}

					}
					else {

						res_params = {
							'statusCode': '404',
							'statusMsg': 'Files Transferred Failed'
						}

					}

					callback(status, res_params);
				});
			}
			else {

				console.log(err);
				callback('Failure',null);
			}

		});
	},

	/**
	* `BridgeService.onHoldHangup`
	*/
	onHoldHangup: function (client,hbridge_params, callback) {

		TblHoldingBridgeModel.find(hbridge_params).exec(function (err, hbridges) {

			if (err) {

				sails.log.error(err);

				callback('Failed','Find failed for HoldingBridge');
			}
			else {

				var bridges = (hbridges!==undefined) ? hbridges : {};

				var itemProcessed = 0;

				bridges.forEach(function (bridge) {

					var hbridge_id = (bridge!==undefined) ? bridge['h_bridgeid'] : '';

					if (hbridge_id.length > 0) {

						var params = {
							'bridgeId': hbridge_id
						};

						BridgeService.get(client, params, function (status, response) {

							if (status == 200) {

								var channels = (response!==undefined) ? response.channels : {};

								channels.forEach(function (channel) {

									var params = {
										'channelId': channel,
										'reason': 'normal'
									};

									ChannelService.hangup(client, params, function (status, response) {

										if (status == 200) {
											sails.log.info('onHoldHangup: Channel Hangup Success' + ' Channel ID: ' + channel);
										}
										else {
											sails.log.info('onHoldHangup: Channel Hangup Failed ' + ' Channel ID: ' + channel);
										}
									});

								});
							}
						});
					}

					if(itemProcessed===bridges.length){

						callback('Success','All Channels under holding bridge hung up');
					}
				});

			}

		});
	},

};
