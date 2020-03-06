// api/services/EventsService.js

const globly = require('globly');
const moment = require('moment');

module.exports = {

	eventActions: function(event) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var eventType = event.type;

		//sails.log.info('************************In Event*******************' + event.type);

		switch(eventType) {

			case 'BridgeCreated':

				var bridge = event.bridge;
				var bridge_name = bridge.name;

				// STEP 1
				//
				// Get user detail from the bridge name
				// e.g. fixers0001:1:1:32260220-1:26011:1523237412797
				//

				var bridgeArray = bridge_name.split(':');
				
				var username = bridgeArray[0];
				var user_id = bridgeArray[1];
				var tenant_id = bridgeArray[2];
				var dial_number = bridgeArray[4];

				sails.log.info('BridgeCreated By: ' + username + ' Bridge Id: ' + bridge.id + ' Bridge Name: ' + bridge_name);

				// STEP 2
				//
				// Log Event
				//

				EventService.saveEvents(user_id, event);

				// STEP 3
				//
				// Check Bridge Type
				// If Mixing continue processing
				// Holding bridges are treated differently
				//

				if (bridge.bridge_type == 'mixing') {

					// STEP 4
					//
					// Update bridge info in the database
					//

					var params = {
						'conference_sid': bridge.id,
						'application': event.application,
						'bridge_type': bridge.bridge_type,
						'name': bridge.name,
						'status': 'created'
					};

					var upd_params = {
						'name': bridge.name,
						'user_id': user_id,
						'tenant_id': tenant_id
					};


					TblConferenceModel.update(upd_params, params).exec(function (err, conference) {

						if (err) {

							var socket_params = {
								'event': 'Bridge',
								'status': 'failed',
								'conference_sid': bridge.id,
								'participant_sid': '',
								'name': bridge.name,
								'user_id': username,
								'tenant_id': tenant_id
							};
			
							sails.sockets.broadcast(username, 'hearing', socket_params);

						}
						else {

							if(conference[0].direction==='outbound'){

								var channel_params = {
									'app': 'app_dars',
									'callerId': sails.config.CALLER_ID,
									//'endpoint': 'PJSIP/' + dial_number,// + '@' + sails.config.EXT_SIP_TRUNK,
									'endpoint': 'PJSIP/' + dial_number + '@' + sails.config.EXT_SIP_TRUNK,
									'appArgs':bridge.id + ','+ 'announcer' + ',' + username + ',' +  user_id + ',' + tenant_id,
									'conference_sid': bridge.id,
									'phone_number': dial_number,
									'timeout': 120,
									'role': 'announcer',
									'user_id': user_id,
									'tenant_id': tenant_id,
									'username': username
								};
	
								BridgeService.addMember(client,channel_params, function (status, response) {
	
	
									var participant_sid = (response!=undefined) ? response.id : ' ';
	
									
									if (participant_sid.length > 1) {
										
										sails.log.info('User: ' + username + 'Result: Hearing Officer Added ' + ' Participant ID: ' + participant_sid + ' Conference ID: ' + bridge.id);
	
										var socket_params = {
											'event': 'Bridge',
											'status': 'started',
											'conference_sid': bridge.id,
											'participant_sid': participant_sid,
											'name': bridge.name,
											'user_id': username,
											'tenant_id': tenant_id
										};
						
										sails.sockets.broadcast(username, 'hearing', socket_params);
					
									}
									else {
			
				
										// Console Log
										//
										
										var socket_params = {
											'event': 'Bridge',
											'status': 'failed',
											'conference_sid': bridge.id,
											'participant_sid': '',
											'name': bridge.name,
											'user_id': username,
											'tenant_id': tenant_id
										};
						
										sails.sockets.broadcast(username, 'hearing', socket_params);
				
									}
	
								});
							}
							
						}

					});
				}

				break;

			case 'BridgeDestroyed':

				// STEP 1
				//
				// Get user detail from the bridge name
				// e.g. fixers0001:1:1:32260220-1:26011:1523237412797
				//

				var bridge = event.bridge;
				var bridge_name = bridge.name;

				var bridgeArray = bridge_name.split(':');
				
				var username = bridgeArray[0];
				var user_id = bridgeArray[1];
				var tenant_id = bridgeArray[2];
				var dial_number = bridgeArray[4];

				sails.log.info('BridgeDestroyed By: ' + username + ' Bridge Id: ' + bridge.id + ' Bridge Name: ' + bridge_name);

				EventService.saveEvents(user_id, event);

				if (bridge.bridge_type == 'mixing') {

					var socket_params = {
						'event': 'Bridge',
						'status': 'ended',
						'conference_sid': bridge.id,
						'name': bridge.name,
						'user_id': user_id,
						'username': username,
						'tenant_id': tenant_id
					};

					sails.sockets.broadcast(username, 'hearing', socket_params);

					var params = {
						'status': 'ended',
					};


					TblConferenceModel.update({conference_sid: bridge.id}, params).exec(function (err, conference) {

						if (err) {

							sails.log.error(err);

						}
						else {

							//console.log(conference);

						}
					});
				}

				break;
			case 'ChannelCreated':

				var channel = event.channel;

				EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

					if(status==='200'){

						EventService.saveEvents(channel_params['user_id'],event);
					}

				});


				break;

			case 'Dial':

				var peer = event.peer;

				sails.log.info('Dial: Peer ID is ' + peer.id);

				EventService.getChannelUserById(client,peer.id, function (status, channel_params) {

					if(status==='200'){

						var username = channel_params['username'];
						var user_id = channel_params['user_id'];
						var tenant_id = channel_params['tenant_id'];
						var conference_sid = channel_params['conference_sid'];
						var role = channel_params['role'];
						var announcer_sid = channel_params['announcer_sid'];
						var call_to = channel_params['call_to'];

						EventService.saveEvents(user_id, event);

						sails.log.info('In Dial: User ID' + user_id);

						var socket_params = {
							'event': 'Channel',
							'status': event.dialstatus,
							'participant_sid': peer.id,
							'conference_sid': conference_sid,
							'user_id': user_id,
							'role': role,
							'phone': call_to,
							'extension': ''
						};

						sails.sockets.broadcast(username, 'hearing', socket_params);

						if (role==='participant') {

							if(event.dialstatus==='RINGING'){

								var media_params = {
									'bridgeId': conference_sid,
									'playbackId': peer.id,
									'media': 'tone:ring'
								};
								
								BridgeService.playMediaWithId(client, media_params, function (status, response) {
		
								});
							}
							else if(event.dialstatus==='ANSWER'){
								
								var media_params = {
									'playbackId': peer.id
								};

								PlaybackService.stop(client, media_params, function (status, response) {
		
								});
							}
							else if(event.dialstatus==='NOANSWER'){

								var media_params = {
									'bridgeId': conference_sid,
									'playbackId': peer.id,
									'media': 'tone:busy'
								};
								
								BridgeService.playMediaWithId(client, media_params, function (status, response) {
		
								});

							}
							else if(event.dialstatus==='BUSY'){

								var media_params = {
									'bridgeId': conference_sid,
									'playbackId': peer.id,
									'media': 'tone:busy'
								};
								
								BridgeService.playMediaWithId(client, media_params, function (status, response) {
		
								});
							}
							
						}

						var params = {
							'dialstatus': event.dialstatus
						};

						TblConferencePartyModel.update({participant_sid:peer.id}, params).exec(function (err, participant) {

							if (err) {

								sails.log.error(err);
							}
							
						});
					};

				});

				//console.log('channel created: ' + channel.id + " " + channel.name + " " + channel.state);

				break;


			case 'ChannelStateChange':

				var channel = event.channel;
				
				EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

					if(status==='200'){

						EventService.saveEvents(channel_params['user_id'],event);
					}

				});

				var params = {
					'dialstatus': event.dialstatus
				};

				TblConferencePartyModel.update({participant_sid:channel.id}, {state:channel.state}).exec(function (err, participant) {

					if (err) {

						sails.log.error(err);
					}
	
				});


				break;
			case 'StasisStart':

				var channel = event.channel;
				var appArgs = event.args;

				if(appArgs[0]==='inbound'){

					EventService.processInbound(event);
				}
				else {

				
					console.log('channel entered statis: ' + channel.id + ' ' + channel.name + ' ' + channel.state + ' ' + appArgs[0]);

					console.log('\channel arguments: ' + appArgs);

					var username = appArgs[2];
					var user_id = appArgs[3];
					var tenant_id = appArgs[4];

					EventService.saveEvents(user_id,event);

					sails.log.info('StatisStart: User ' + username + ' Channel Id: ' + channel.id + ' Conference Id: ' + appArgs[0] + ' Role: ' + appArgs[1]);

					var upd_params = {
						'role': appArgs[1]
					};

					TblConferencePartyModel.update({participant_sid:channel.id}, upd_params).exec(function (err, participant) {

					});

					var params = {
						'channel': channel.id,
						'bridgeId': appArgs[0],
						'role': appArgs[1]
					};

					console.log(params);

					BridgeService.addChannel(client, params, function (status, response) {

						sails.log.info('BridgeService addChannel Status ' + status);
						sails.log.info({ "message": "Participant " + channel.id + " added to conference " + appArgs[0] });

						sails.log.info('Role is ' + appArgs[1] + ' RECORD ALL CALLS is ' + sails.config.RECORD_ALL_CALLS);

						if (appArgs[1] === 'announcer' && sails.config.RECORD_ALL_CALLS === 'true') {

							EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

								sails.log.info('Status is ' + status + ' Channel Param is  ' + channel_params);

								if(status==='200'){
			
									var epochTime = new Date().valueOf();
									var call_to = channel_params['call_to'];

									var recordingName = username + '_'  + user_id + '_' + tenant_id + '_' + call_to + '_' + epochTime;
									var fileName = call_to + '_' + epochTime;

									var record_dt = moment(new Date()).format('MM/DD/YYYY');
									var record_time = moment(new Date()).format('HH:mm:ss');

									var recordingStore = moment(new Date()).format('YYYY/MM/DD');

									var create_params = {
										'conference_sid': appArgs[0],
										'mediasrvip': sails.config.MEDIASRV_IP,
										'cfpath': recordingName + '.wav',
										'record_name': recordingName,
										'record_dt': record_dt,
										'record_time': record_time,
										'recording_state': 'queued',
										'status': 'Not Loaded',
										'filename': recordingName + '.wav' 
									};

									console.log(create_params);

									TblRecordingsModel.create(create_params).exec(function (error, cr_recording) {

										if (error) {

											sails.log.error(error);

										}
										else {

											sails.log.info(' Recording record created');

										}


									});

									var record_params = {
										'name': recordingName,
										'format': 'wav',
										'maxDurationSeconds': '0',
										'maxSilenceSeconds': '0',
										'ifExists': 'overwrite',
										'terminateOn': 'none',
										'bridgeId': appArgs[0],
										'beep': true
									};

									console.log(record_params);

									setTimeout(() => {

										RecordingService.recordBridge(client, record_params, function (status, response) {

											sails.log.info('RecordingServce recordBridge Status ' + status);
											sails.log.info(response);
										});

									}, 200);
								}
			
							});

						};

					});

				}


				break;
			
			case 'StasisEnd':
				var channel = event.channel;

				EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

					if(status==='200'){

						EventService.saveEvents(channel_params['user_id'],event);
					}

				});

				break;

			case 'ChannelEnteredBridge':

				var bridge = event.bridge;
				var channel = event.channel;

				var bridge_name = bridge.name;
				var bridgeArray = bridge_name.split(':');

				var username = bridgeArray[0];
				var user_id = bridgeArray[1];
				var tenant_id = bridgeArray[2];

				EventService.saveEvents(user_id,event);

				if(bridge.bridge_type == 'mixing') {

					var find_params = {
						'participant_sid': channel.id
					};
					
					TblConferencePartyModel.find(find_params).exec(function (err, conferenceMember) {

						var confMemberLength = (conferenceMember != undefined) ? conferenceMember.length : 0;

						if (confMemberLength > 0) {

							var conference_sid = conferenceMember[0].conference_sid;
							var state = conferenceMember[0].state;

							sails.log.info('ChannelEnteredBridge - ' + ' Conference Id: ' + conference_sid + ' Participant Id: ' + channel.id + ' State: ' + state);

							if (state != 'hold' && state != 'unhold') {

								var socket_params = {
									'event': 'Channel',
									'status': 'joined',
									'participant_sid': channel.id,
									'conference_sid': bridge.id,
									'user_id': username,
									'role': conferenceMember[0].role,
									'phone': conferenceMember[0].call_to,
									'extension': conferenceMember[0].extension,
									'id': conferenceMember[0].id
								};
								
								sails.sockets.broadcast(username, 'hearing', socket_params);

								if (conferenceMember[0].role == 'participant') {

									var find_params = {
										'conference_sid': bridge.id,
										'role': 'announcer'
									};

									TblConferencePartyModel.find(find_params).exec(function (err, conferenceMember) {

										var confMemberLength = (conferenceMember != undefined) ? conferenceMember.length : 0;

										if (conferenceMember > 0) {

											var media_params = {
												'channelId': conferenceMember[0].participant_sid,
												'media': 'sound:confbridge-join'
											};

											ChannelService.playMedia(client, media_params, function (status, response) {

											});

										}

									});
								}

							}

							var params = {
								'state': 'joined',
								'conference_sid': bridge.id
							}

							TblConferencePartyModel.update({ participant_sid: channel.id }, params).exec(function (err, participant) {
								if (err) {

									sails.log.error(err);
								}
							});
						}
					});

				}
				else {

					var mainConfBridge = bridgeArray[1];

					var params = {
						'state': 'hold',
						'participant_sid': channel.id,
					}

					TblConferencePartyModel.update({participant_sid: channel.id}, params).exec(function (err, participant) {

						if (err) {

							sails.log.error(err);
						}
					});

					var socket_params = {
						'event': 'Channel',
						'status': 'hold',
						'participant_sid': channel.id,
						'conference_sid': mainConfBridge,
						'hold_conference_sid': bridge.id,
						'user_id': user_id,
					};

					sails.sockets.broadcast(username, 'hearing', socket_params);

				}

				break;

			case 'ChannelHangupRequest':
				var channel = event.channel;

				EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

					if(status==='200'){

						EventService.saveEvents(channel_params['user_id'],event);
					}

				});

				var media_params = {
					'playbackId': channel.id
				};

				PlaybackService.stop(client, media_params, function (status, response) {

				});

				//console.log('channel requested hangup: ' + channel.id + " " + channel.name + "  + channel.state);

				break;
			case 'ChannelLeftBridge':

				var bridge = event.bridge;
				var channel = event.channel;

				var bridge_name = bridge.name;
				var bridgeArray = bridge_name.split(':');

				var username = bridgeArray[0];
				var user_id = bridgeArray[1];
				var tenant_id = bridgeArray[2];

				EventService.saveEvents(user_id,event);


				console.log('****Channel Left Bridge****');
				console.log('****Bridge Id: ' + bridge.id + ' Bridge Type: ' + bridge.type + ' Channels:' + bridge.channels + '****');
				console.log('****Channel Id: ' + channel.id + ' Channel Name:'  + channel.name + ' Channel State:' + channel.state+'****');

				//sails.sockets.broadcast(req.session.username,'hearing', bridge);

				if(bridge.bridge_type == 'mixing') {
					
					var find_params = {
						'participant_sid': channel.id
					};

					TblConferencePartyModel.find(find_params).exec(function (err, conferenceMember) {

						var confMemberLength = (conferenceMember != undefined) ? conferenceMember.length : 0;

						if (confMemberLength == 1) {

							var conference_sid = conferenceMember[0].conference_sid;
							var state = conferenceMember[0].state;

							if (state != 'hold' && state != 'unhold') {

								var socket_params = {
									'event': 'Channel',
									'status': 'left',
									'participant_sid': channel.id,
									'conference_sid': bridge.id,
									'user_id': user_id,
									'role': conferenceMember[0].role,
									'phone': conferenceMember[0].call_to,
									'extension': conferenceMember[0].extension,
									'id': conferenceMember[0].id
								};

								sails.sockets.broadcast(username, 'hearing', socket_params);

								if (conferenceMember[0].role == 'participant') {

									var find_params = {
										'conference_sid': bridge.id,
										'role': 'announcer'
									};

									TblConferencePartyModel.find(find_params).exec(function (err, conferenceMember) {

										if (conferenceMember.length == 1) {

											var media_params = {
												'channelId': conferenceMember[0].participant_sid,
												'media': 'sound:confbridge-leave'
											};

											ChannelService.playMedia(client, media_params, function (status, response) {

											});

										}

									});
								}

								var params = {
									'state': 'left',
									'conference_sid': bridge.id
								}

								TblConferencePartyModel.update({ participant_sid: channel.id }, params).exec(function (err, participant) {
									if (err) {

										sails.log.error(err);
									}
								});
							}
						}
					});
				}
				else {

					var mainConfBridge = bridgeArray[1];

					var params = {
						'state': 'unhold',
						'participant_sid': channel.id,
					}

					TblConferencePartyModel.update({participant_sid: channel.id}, params).exec(function (err, participant) {

						if (err) {

							sails.log.error(err);
						}
					});

					var socket_params = {
						'event': 'Channel',
						'status': 'unhold',
						'participant_sid': channel.id,
						'conference_sid': mainConfBridge,
						'hold_conference_sid': bridge.id,
						'user_id': user_id,
					};

					sails.sockets.broadcast(username, 'hearing', socket_params);

				}

				break;

			case 'ChannelDestroyed':

				var channel = event.channel;
				
				EventService.getChannelUserById(client,channel.id, function (status, channel_params) {

					sails.log.info('In ChannelDestroyed');

					if(status==='200'){

						EventService.saveEvents(channel_params['user_id'],event);

						var user_id = channel_params['user_id'];
						var user_name = channel_params['user_name'];
						var conference_sid = channel_params['conference_sid'];
						var role = channel_params['role'];
						var call_to = channel_params['call_to'];
						
						var params = {
							'cause': event.cause,
							'cause_txt': event.cause_txt
						};
					
						TblConferencePartyModel.update({participant_sid:channel.id}, params).exec(function (err, participant) {

							if (!err) {

								if (role==='announcer') {

									var params = {
										'bridgeId': conference_sid
									};

									BridgeService.get(client, params, function (status, response) {

										if (status == 200) {

											let channels = (response != undefined) ? response.channels : {};

											for (let i = 0; i < channels.length; i++) {

												var channel_params = {
													'channelId': channels[i],
													'reason': 'normal'
												};

												ChannelService.hangup(client, channel_params, function (status, response) {


												});
											}

											var bridgeId = (response != undefined) ? response.id : 0;

											if (bridgeId != 0) {

												var params = {
													'bridgeId': bridgeId
												};

												BridgeService.hangup(client, params, function (status, response) {

												});

											}

										}

									});

									var hbridge_params = {
										'c_bridgeid': conference_sid
									};

									BridgeService.onHoldHangup(client, hbridge_params, function (status, response) {

										TblHoldingBridgeModel.destroy(hbridge_params).exec(function (err, conference) {

											if (!err) {

												sails.log.info('Holding Bridge removed from the DB');
											}
											else {

												sails.log.error(err);
											}
										});

									});

								}
								else {

									var socket_params = {
										'event': 'Channel',
										'status': 'dropped',
										'participant_sid': channel.id,
										'conference_sid': conference_sid,
										'user_id': user_id,
										'role': role,
										'phone': call_to,
										'cause': event.cause_txt
									};

									sails.sockets.broadcast(user_name, 'hearing', socket_params);

								}

							}

						});

					}

				});
				
				//console.log('channel destroyed: ' + channel.id + " " + channel.name + " " + channel.state + " " + channel.cause +" "+ channel.cause_txt);

				break;
			case 'PlaybackStarted':

				var playback = event.playback;

				
				var media_uri = playback.media_uri;

				if (media_uri==='tone:busy') {

					var media_params = {
						'playbackId': playback.id
					};

					setTimeout(() => {
						PlaybackService.stop(client, media_params, function (status, response) {

						});
					},2000);
				}

				//console.log('Playback Started: ' + playback.id + " " + playback.media_uri + " " + playback.target_uri + " " + playback.state);

				EventService.saveEvents('0',event);

				break;
			case 'PlaybackFinished':

				var playback = event.playback;

				//console.log('Playback Finished: ' + playback.id + " " + playback.media_uri + " " + playback.target_uri + " " + playback.state);

				EventService.saveEvents('0',event);

				break;

			case 'ChannelVarset':
				
				var channel = event.channel;

				if(channel!==undefined) {

					var value = (event.value !== undefined) ? event.value : 'Not Applicable';

					sails.log.info('Event Type: ' + event.type + ' Variable: ' + event.variable + ' Value: ' + value + ' Channel ' + channel.id);

					var set_params ={
						'channelId': channel.id,
						'variable': 'channel_detail'
					}
		
					ChannelService.getVariable(client, set_params, function (getStatus, getResponse) {

						if(getStatus==='200') {

							var value = (getResponse!==undefined && getResponse.length>0) ? getResponse.value : '';

							if(value.length > 0){

								var channel_params = value.split(':');
						
								EventService.saveEvents(channel_params[1],event);
							}
						}

					});
				}
				else {

					EventService.saveEvents('0',event);
					sails.log.info('In Default Case - Event Type: ' + event.type);
					//console.log(event);
	
					break;
				}
				
				

				//console.log('Playback Finished: ' + playback.id + " " + playback.media_uri + " " + playback.target_uri + " " + playback.state);

				break;

			case 'RecordingStarted':

				var recording = event.recording;

				console.log('Target Recording URI is ' + recording.target_uri);

				var targetUri = recording.target_uri.split(':');
				var conference_sid = targetUri[1];

				var recordingName = recording.name.split('_');

				var username = recordingName[0];
				var user_id = recordingName[1];
				var tenant_id = recordingName[2];
				var call_to = recordingName[3];

				EventService.saveEvents(user_id, event);

				sails.log.info('Event Type: ' + event.type + ' Name: ' + recording.name + ' Bridge Id ' + targetUri[1] + ' Format: ' + recording.format + ' State ' + recording.state);

				var socket_params = {
					'event': 'LocalRecording',
					'status': 'started',
					'user_id': user_id,
					'phone': call_to,
					'record_name': recording.name
				};
	
				sails.sockets.broadcast(username, 'hearing', socket_params);
				
				var upd_params = {
					'recording_state': recording.state
				};
				
				TblRecordingsModel.update({conference_sid:conference_sid},upd_params).exec(function (error, cr_recording) {

					if(error){

						sails.log.error(error);

					}
					else{

						sails.log.info(' Recording record updated');

					}

				
				});

				break;

			case 'RecordingFinished':

				var recording = event.recording;

				var targetUri = recording.target_uri.split(':');
				var conference_sid = targetUri[1];

				var recordingName = recording.name.split('_');

				var username = recordingName[0];
				var user_id = recordingName[1];
				var tenant_id = recordingName[2];
				var call_to = recordingName[3];

				EventService.saveEvents(user_id, event);

				sails.log.info('Event Type: ' + event.type + ' Name: ' + recording.name + ' Bridge Id ' + targetUri[1] + ' Format: ' + recording.format + ' State ' + recording.state);

				var socket_params = {
					'event': 'LocalRecording',
					'status': 'finished',
					'user_id': user_id,
					'phone': call_to,
					'record_name': recording.name
				};
	
				sails.sockets.broadcast(username, 'hearing', socket_params);

				var upd_params = {
					'recording_state': recording.state
				};
				
				TblRecordingsModel.update({conference_sid:conference_sid},upd_params).exec(function (error, cr_recording) {

					if(error){

						sails.log.error(error);

					}
					else{

						sails.log.info(' Recording record updated');

						var curr_date = new Date();
						var record_dt = moment(curr_date).format('MM/DD/YYYY');

						if (sails.config.RECORD_ALL_CALLS==='true') {

							setTimeout(() => {

								xfer_params = {
									'filename': recording.name + '.wav'
								}

								RecordingService.xfer(xfer_params, function (status, response) {

									sails.log.info('Action: RecordingService.xfer' + ' Result: ' + status);
									
									if (status == 'Success') {

										sails.log.info(' Recording for Hearing ' + targetUri[1] + ' Successfully Transferred');

										setTimeout(() => {
											
											var socket_params = {
												'event': 'LocalRecording',
												'status': 'file',
												'user_id': user_id,
												'phone': call_to,
												'filename': '/audio/' + recording.name + '.'+ sails.config.RECORD_FORMAT
											};
	
											sails.sockets.broadcast(username, 'hearing', socket_params);

										}, 500);
									}
									else {

										sails.log.info(' Recording for Hearing ' + targetUri[1] + ' Failed Transferred');

									};
								});
							}, 1000);

						}
					}

				
				});

				break;

			case 'RecordingFailed':

				var recording = event.recording;

				var targetUri = recording.target_uri.split(':');
				var conference_sid = targetUri[1];

				var recordingName = recording.name.split('_');
				var username = recordingName[0];
				var user_id = recordingName[1];
				var tenant_id = recordingName[2];
				var call_to = recordingName[3];

				EventService.saveEvents(user_id, event);

				sails.log.info('Event Type: ' + event.type + ' Name: ' + recording.name + ' Bridge Id ' + targetUri[1] + ' Format: ' + recording.format + ' State ' + recording.state);

				var socket_params = {
					'event': 'LocalRecording',
					'status': 'failed',
					'user_id': user_id,
					'phone': call_to,
					'record_name': recording.name
				};
	
				sails.sockets.broadcast(username, 'hearing', socket_params);

				var upd_params = {
					'recording_state': recording.state
				};
				
				TblRecordingsModel.update({conference_sid:conference_sid},upd_params).exec(function (error, cr_recording) {

					if(error){

						sails.log.error(error);

					}
					else{

						sails.log.info(' Recording record updated');

					}

				
				});

				break;

			case 'ChannelHold':

				var channel = event.channel;

				EventService.getChannelUserById(client, channel.id, function (status, channel_params) {

					if (status === '200') {

						EventService.saveEvents(channel_params['user_id'], event);
					}

				});

				break;
			case 'ChannelUnhold':

				var channel = event.channel;

				EventService.getChannelUserById(client, channel.id, function (status, channel_params) {

					if (status === '200') {

						EventService.saveEvents(channel_params['user_id'], event);
					}

				});

				break;
			case 'ChannelTalkingStarted':

				var channel = event.channel;

				console.log('In Talking Started Channel ID is ' + channel.id);

				EventService.getChannelUserById(client,channel.id,function (status, channel_params) {

					sails.log.info('In Talking Started for Channel ' + channel.id + ' Status is ' + status + ' Channel Params ' + channel_params);
					console.log(channel_params);


					if (status=='200') {

						EventService.saveEvents(channel_params['user_id'], event);

						var socket_params = {
							'event': 'Channel',
							'status': 'TalkingStarted',
							'participant_sid': channel.id,
							'conference_sid': channel_params['conference_sid'],
							'user_id': channel_params['user_id']
						};

						sails.sockets.broadcast(channel_params['username'], 'hearing', socket_params);
					}

				});

				break;
			
			case 'ChannelTalkingFinished':

				var channel = event.channel;

				EventService.getChannelUserById(client, channel.id, function (status, channel_params) {

					sails.log.info('In Talking Started ' + status + ' Channel Params ' + channel_params);

					if (status=='200') {

						EventService.saveEvents(channel_params['user_id'], event);

						var socket_params = {
							'event': 'Channel',
							'status': 'TalkingFinished',
							'participant_sid': channel.id,
							'conference_sid': channel_params['conference_sid'],
							'user_id': channel_params['user_id']
						};

						sails.sockets.broadcast(channel_params['username'], 'hearing', socket_params);
					}

				});

				break;
			default:

			    EventService.saveEvents('0',event);
				sails.log.info('In Default Case - Event Type: ' + event.type);
				//console.log(event);

				break;
		}
	},

	/**
	* `EventService.get()`
	*/
	get: function (client,params, callback) {

		client.get_events(params, function (status, response) {

			callback(null,response);

		});
	},


	/**
	* `EventService.generate()`
	*/
	generate: function (client,params, callback) {

		client.generate_events(params, function (status, response) {

			callback(null,response);

		});
	},

	/**
    * Get Channel User details by CHannelId
	* EventsService.getChannelUserById
	*
	*/

	getChannelUserById: function(client,channelId,callback){

		var channel_params;

		var set_params ={
			'channelId': channelId,
			'variable': 'channel_detail'
		}
	
		console.log(set_params);

		ChannelService.getVariable(client, set_params, function (getStatus, getResponse) {

			if(getStatus === 200) {
				
				sails.log.info('getChannelUserById: Get Status ' + getStatus +' and the Value is ' + getResponse.value);

				var value = (getResponse!==undefined) ? getResponse.value : '';

				var channel_detail = value.split(':');

				console.log(channel_detail);

				channel_params = {
					'username': channel_detail[0],
					'user_id': channel_detail[1],
					'tenant_id': channel_detail[2],
					'conference_sid': channel_detail[3],
					'call_to': channel_detail[4],
					'role': channel_detail[5]
				};

				if(channel_detail[5]==='participant'){

					channel_params['announcer_sid'] = channel_detail[5];
				}
				else {

					channel_params['announcer_sid'] = '';
				}

				console.log(channel_params);

				callback('200',channel_params);

			}
			else {

				  VwConferencePartyModel.find({participant_sid: channelId}).exec(function (err, findResult) {
					
					if(!err){
		
						var resultLength = (findResult != undefined) ? findResult.length : 0;
		
						if (resultLength > 0) {
							
							channel_params = {
								'user_id': findResult[0].user_id,
								'tenant_id': findResult[0].tenant_id,
								'user_name': findResult[0].user_name,
								'conference_sid': findResult[0].conference_sid,
								'call_to': findResult[0].call_to,
								'role': findResult[0].role,
								'announcer_sid': findResult[0].announcer_sid
							};

							callback('200',channel_params);
						}
						else {
		
							callback('404',null);
						}
		
					}
					else{

						callback('404',null);
					}
					
				});
			}

		});
		
	},

	/**
    * Logs ARI Events
	* EventsService.saveEvents
	*
	*/

	saveEvents: function(userId,event){

		var event_params = {
			'user_id': userId,
			'type': event.type,
			'body': JSON.stringify(event)
		};

		if(sails.config.LOG_TO_FILE==='true'){

			LoggingService.saveEventsToFile(event_params);
		}
		else {

			TblEventsModel.create(event_params).exec(function(err,events) {

				if(err) {
				
					sails.log.error(err);
	
				}
			});

		}
		
	},

	/**
    * Inbound Conference Changes
	* EventsService.processInbound
	*
	*/

	processInbound: function(event){

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var channel = event.channel;
		var appArgs = event.args;

		var docketNo = appArgs[1];
		
		var params = {
			'channelId': channel.id
		};

		ChannelService.answerChannel(client,params, function (status, response) {

			console.log('Answer Channel status is ' + status);

		});

		params = {
			'issue_id': docketNo
		};

		

		HearingService.list(params, function (error, response) {

			if (response != undefined && response != null) {

				if (response.length > 0) {

					var username = response[0].username;
					var user_id = response[0].user_id;
					var tenant_id = response[0].tenant_id;
					var endpoint_number = '7044565012';
					var epochTime = new Date().valueOf();

					EventService.saveEvents(user_id,event);

					var hearingName = username + ':' + user_id + ':' + tenant_id + ':' + docketNo +'-6' + ':' + endpoint_number + ':' + epochTime;

					sails.log.info(' User: ' + username + 'Action: Generate Hearing Name ' + 'Hearing Name:' + hearingName);

					sails.log.info(' User: ' + username + 'Action: start_hearing');

					var params = {
						'tenant_id': tenant_id,
						'user_id': user_id,
						'docket_number': docketNo +'-6',
						'name': hearingName,
						'status': 'initiated',
						'direction': 'inbound',
						'bridge_type': 'mixing'
					};

					TblConferenceModel.create(params).exec(function (err, conference) {

						if (err) {
		
							sails.log.error(err);
						}
						else {
		
							BridgeService.create(client, params, function (status, response) {
		
								var conference_sid = (response != undefined) ? response.id : ' ';
		
								//req.session.conference_sid = conference_sid;
		
								sails.log.info(' User: ' + username + 'Action: Conference Record Created in Table ' + conference_sid);
		
								// Console Log
								//
		
								if (conference_sid.length > 1) {
		
									sails.log.info(' User: ' + username + 'Action: Bridge Created ' + ' Bridge ID:' + conference_sid);
		
									var res_params = {
										'statusCode': '200',
										'statusMessage': 'Hearing ' + conference_sid + ' Initiated ',
										'conference_sid': conference_sid,
										'participant_sid': '',
										'role': 'announcer'
									}
									
									var socket_params = {
										'event': 'Bridge',
										'status': 'started',
										'conference_sid': conference_sid,
										'participant_sid': channel.id,
										'name': hearingName,
										'user_id': username,
										'tenant_id': tenant_id
									};
					
									sails.sockets.broadcast(username, 'hearing', socket_params);

									var params = {
										'channel': channel.id,
										'bridgeId': conference_sid,
										'role': 'announcer'
									};
				
									console.log(params);
									
									var appArgs = [conference_sid,'announcer'];

									BridgeService.addChannel(client, params, function (status, response) {
				
										sails.log.info('BridgeService addChannel Status ' + status);
										sails.log.info({ "message": "Participant " + channel.id + " added to conference " + appArgs[0] });
				
										sails.log.info('Role is ' + appArgs[1] + ' RECORD ALL CALLS is ' + sails.config.RECORD_ALL_CALLS);
				
										if (appArgs[1] === 'announcer' && sails.config.RECORD_ALL_CALLS === 'true') {
				
											EventService.getChannelUserById(client,channel.id, function (status, channel_params) {
				
												sails.log.info('Status is ' + status + ' Channel Param is  ' + channel_params);
				
												if(status==='200'){
							
													var epochTime = new Date().valueOf();
													var call_to = '7044565012'; //channel_params['call_to'];
				
													var recordingName = username + '_'  + user_id + '_' + tenant_id + '_' + call_to + '_' + epochTime;
				
													var record_dt = moment(new Date()).format('MM/DD/YYYY');
													var record_time = moment(new Date()).format('HH:mm:ss');
				
													var create_params = {
														'conference_sid': appArgs[0],
														'mediasrvip': sails.config.MEDIASRV_IP,
														'cfpath': recordingName + '.wav',
														'record_name': recordingName,
														'record_dt': record_dt,
														'record_time': record_time,
														'recording_state': 'queued',
														'status': 'Not Loaded',
														'filename': recordingName + '.wav' 
													};
				
													console.log(create_params);
				
													TblRecordingsModel.create(create_params).exec(function (error, cr_recording) {
				
														if (error) {
				
															sails.log.error(error);
				
														}
														else {
				
															sails.log.info(' Recording record created');
				
														}
				
				
													});
				
													var record_params = {
														'name': recordingName,
														'format': 'wav',
														'maxDurationSeconds': '0',
														'maxSilenceSeconds': '0',
														'ifExists': 'overwrite',
														'terminateOn': 'none',
														'bridgeId': appArgs[0],
														'beep': true
													};
				
													console.log(record_params);
				
													setTimeout(() => {
				
														RecordingService.recordBridge(client, record_params, function (status, response) {
				
															sails.log.info('RecordingServce recordBridge Status ' + status);
															sails.log.info(response);
														});
				
													}, 200);
												}
							
											});
				
										};
				
									});

									console.log(res_params);
								}
								else {
		
									var res_params = {
										'statusCode': '409',
										'statusMessage': 'Cannot start the hearing. Please consult IT Support'
									}
		
									// Console Log
									//
		
									sails.log.info('User: ' + username + ' Result: Hearing Start Failed. ' + conference_sid);
		
									console.log(res_params);
		
								}
							});
		
						}
					});

				}
				else {

					var res_params = {
						'statusCode': '404',
						'statusMsg': 'No data found'
					}
					console.log(res_params);
				}

			}
			else {

				var res_params = {
					'statusCode': '404',
					'statusMsg': 'No data found'
				}
				console.log(res_params);
			}


		});

		
	}

};

