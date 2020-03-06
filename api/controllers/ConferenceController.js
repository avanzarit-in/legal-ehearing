/**
 * ConferenceController
 *
 * @description :: Server-side logic for managing Conferences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const globly = require('globly');
const moment = require('moment');

module.exports = {

	/**
	* `ConferenceController.start_hearing`
	* This controller creates a conference bridge and dials the hearing officer
	* POST http://api.globly.co/v1/Accounts/{auth_id}/start_hearing/
	*
   */
	start_hearing: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var currentDate = new Date();
		var epochTime = new Date().valueOf();

		if(req.session.username!=='undefined' || req.session.username!==undefined){

			var endpoint_number = '';

			if (req.param('member_phone').length >= 10) {

				endpoint_number = sails.config.DIAL_PREFIX + req.param('member_phone');

			}
			else {

				endpoint_number = req.param('member_phone');

			}

			var hearingName = req.session.username + ':' + req.session.user_id + ':' + req.session.tenant_id + ':' + req.param('docket_number') + ':' + endpoint_number + ':' + epochTime;

			sails.log.info(' User: ' + req.session.username + 'Action: Generate Hearing Name ' + 'Hearing Name:' + hearingName);

			var params = {
				'name': hearingName,
				'type': 'mixing'
			};

			//req.session.conference_name = req.param('docket_number');
			// Console Log
			//

			sails.log.info(' User: ' + req.session.username + 'Action: start_hearing');

			var params = {
				'tenant_id': req.session.tenant_id,
				'user_id': req.session.user_id,
				'docket_number': req.param('docket_number'),
				'name': hearingName,
				'status': 'initiated',
				'direction': 'outbound',
				'bridge_type': 'mixing'
			};

			TblConferenceModel.create(params).exec(function (err, conference) {

				if (err) {

					sails.log.error(err);
				}
				else {

					BridgeService.create(client, params, function (status, response) {

						var conference_sid = (response != undefined) ? response.id : ' ';

						req.session.conference_sid = conference_sid;

						sails.log.info(' User: ' + req.session.username + 'Action: Conference Record Created in Table ' + conference_sid);

						// Console Log
						//

						if (conference_sid.length > 1) {

							sails.log.info(' User: ' + req.session.username + 'Action: Bridge Created ' + ' Bridge ID:' + conference_sid);

							var res_params = {
								'statusCode': '200',
								'statusMessage': 'Hearing ' + conference_sid + ' Initiated ',
								'conference_sid': conference_sid,
								'participant_sid': '',
								'role': 'announcer'
							}

							res.status(200).send(res_params);
						}
						else {

							var res_params = {
								'statusCode': '409',
								'statusMessage': 'Cannot start the hearing. Please consult IT Support'
							}

							// Console Log
							//

							sails.log.info('User: ' + req.session.username + ' Result: Hearing Start Failed. ' + conference_sid);

							res.status(409).send(res_params);

						}
					});

				}
			});

		}
		else {

			var res_params = {
				'statusCode': '409',
				'statusMessage': 'Cannot start the hearing. Please consult IT Support'
			}

			// Console Log
			//

			sails.log.info('User Name undefined. ' + req.session.username);

			res.status(409).send(res_params);

		}
				
	},

	
	/**
	* `ConferenceController.list`
	* This controller gets details about all live conferences
	* GET http://api.globly.co/v1/Accounts/{auth_id}/Conference/
	*
   */
	list: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {};

		BridgeService.list(client,params,function(error,response){

			res.json(response);

		});

	},


	/**
	* `ConferenceController.get`
	* This controller gets detail about a single conference identified by conference_sid
	* GET http://api.globly.co/v1/Accounts/{auth_id}/Conference/{conference_sid}
	*
   */
	get: function (req, res) {

		var res_params = {};

		TblConferenceModel.find({conference_sid:req.param('conference_sid')}).exec(function(err,conference) {

			if(err) {

				var res_params = {
					'statusCode': '409',
					'statusMessage': 'Database error has occured. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(409).send(res_params);
			}
			else {

				if(conference.length > 0) {

					res_params = {
						'statusCode': '200',
						'statusMessage': 'Hearing detail',
						'conference_sid': req.param('conference_sid'),
						'docket_number': conference[0].docket_number,
						'issue_id': conference[0].issue_id,
						'issue_seq_number': conference[0].issue_seq_number,
						'claim_type_cd': conference[0].claim_type_cd,
						'claim_type_desc': conference[0].claim_type_desc,
						'officer': conference[0].officer,
						'site_location': conference[0].site_location,
						'participants': {}
					}

					TblConferencePartyModel.find({conference_sid:req.param('conference_sid')}).exec(function(err,participant) {

						var participants = new Array();

						if(err) {};

						for (var i=0; i < participant.length; i++) {

							var participant_array = {

								'participant_sid': participant[i].participant_sid,
								'partyType_cd': participant[i].partyType_cd,
								'partyType_desc': participant[i].partyType_desc,
								'party_id': participant[i].party_id,
								'first_name': participant[i].first_name,
								'middle_name': participant[i].middle_name,
								'last_name': participant[i].last_name,
								'business_name': participant[i].business_name,
								'phone_number': participant[i].phone_number,
								'extension': participant[i].extension,
								'role': participant[i].role, /* announcer or participant*/
								'state': participant[i].state
							}

							participants.push(participant_array);
						}

						res_params['participants'] = participants;

						res.status(200).send(res_params);
					});


				}
				else {

					var res_params = {
						'statusCode': '404',
						'statusMessage': 'Hearing not found',
						'conference_sid': req.param('conference_sid')
					}

					res.status(404).send(res_params);
				}

			}

		});

	},


	/**
	* `ConferenceController.hangup_all`
	* Destroy all active conference and hangup on all members
	* DELETE http://api.globly.co/v1/Accounts/{auth_id}/Conference/
	*
   */
	hangup_all: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {};

		// Console Log
		//

		sails.log.info('Method: hangup_all'); 

		BridgeService.list(client,params,function(error,response){

			for(var i = 0; i < response.length; i++){

				var confObj = response[i];
				var bridgeId = confObj.id;

				let channels = confObj.channels;

					for (let count = 0; count < channels.length; count++) {

						var params = {
							'channelId': channels[count],
							'reason': 'normal'
						};

						ChannelService.hangup(client,params, function (status, response) {

							//console.log(response);

						});
					}

				var params = {
					'bridgeId': bridgeId
				};

				BridgeService.hangup(client,params, function (status, response) {

					//console.log(response);
				});

			}

			res.status(200).send({"message":"all conferences hung up"});

		});

	},


	/**
	* `ConferenceController.end_hearing`
	* Destroy a single conference and hangup all members
	* DELETE http://api.globly.co/v1/Accounts/{auth_id}/Conference/{conference_sid}
	*
   */
	end_hearing: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {

			'bridgeId': req.param('conference_sid')
		};

		// Console Log
		//

		sails.log.info('User: ' + req.session.username + 'Action: end_hearing' + ' Bridge ID: ' + req.param('conference_sid')); 

		BridgeService.get(client,params,function(status,response){

			if(status == 200) {

				// Console Log
				//

				sails.log.info(' User: ' + req.session.username + 'Action: Bridge Look Up ' + ' Conference ID: ' + req.param('conference_sid'));

				var channels = (response!==undefined) ? response.channels : {};
				
				var itemProcessed = 0;

				channels.forEach(function(channel) {

					var params = {
						'channelId': channel,
						'reason': 'normal'
					};

					ChannelService.hangup(client,params, function (status, response) {

						if(status===204) {
							sails.log.info('User: ' + req.session.username + ' Action: Channel Hangup Success' + ' Channel ID: ' + channel);
						}
						else {
							sails.log.info('User: ' + req.session.username + ' Action: Channel Hangup Failed ' + ' Channel ID: ' + channel);
						}

					});

					itemProcessed++;

					if(itemProcessed===channels.length){

						var params = {

							'bridgeId': req.param('conference_sid')
						};
		
						BridgeService.hangup(client,params, function (status, response) {
											
							if(status == 404){
		
								// Console Log
								//
		
								sails.log.info(' User: ' + req.session.username + ' Action: Bridge Hangup Failed ' + ' Conference ID: ' + req.param('conference_sid'));
		
								var res_params = {
									'statusCode': status,
									'statusMessage': 'Bridge not found',
									'conference_sid': req.param('conference_sid')
								}
		
								res.status(200).send(res_params);
		
							}
							else {
		
								// Console Log
								//
		
								sails.log.info(' User: ' + req.session.username + ' Action: Bridge Hangup Success ' + ' Conference ID: ' + req.param('conference_sid'));
		
		
								var res_params = {
									'statusCode': status,
									'statusMessage': 'Hearing successfully ended.',
									'conference_sid': req.param('conference_sid')
								}
		
								res.status(200).send(res_params);
		
							}
		
						});

						var hbridge_params = {
							'c_bridgeid': req.param('conference_sid')
						};
		
						BridgeService.onHoldHangup(client, hbridge_params, function (status, response) {
		
							var hbridge_params = {
								'c_bridgeid': req.param('conference_sid')
							};
							
							TblHoldingBridgeModel.destroy(hbridge_params).exec(function(err,conference) {
		
								if(!err){
		
									sails.log.info('Holding Bridge removed from the DB');
								}
								else {
		
									sails.log.error(err);
								}
							});
		
						});
					}

				});

			}
			else if(status == 404) {

				// Console Log
				//

				sails.log.info(' User: ' + req.session.username + 'Action: Bridge Not Found ' + ' Conference ID: ' + req.param('conference_sid'));


				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Bridge not found',
					'conference_sid': req.param('conference_sid')
				}

				res.status(200).send(res_params);
			}
			else {

				// Console Log
				//

				sails.log.info(' User: ' + req.session.username + 'Action: Bridge Hangup Error ' + ' Conference ID: ' + req.param('conference_sid'));

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(200).send(res_params);
			}

		});


	},

	/**
	* `ConferenceController.start_moh()`
	*/
	start_moh: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};

		BridgeService.startMoh(client,params, function (status, response) {

			res.status(status).send(response);

		});
	},


	/**
	* `ConferenceController.stop_moh()`
	*/
	stop_moh: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};

		BridgeService.stopMoh(client,params, function (status, response) {

			res.status(status).send(response);

		});

	},


	/**
	* `ConferenceController.join`
	*/

	join_conference: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channel': req.param('participant_sid'),
			'bridgeId': req.param('conference_sid'),
			'role': req.param('role')			// role - participant or announcer
		};

		BridgeService.addChannel(client,params, function (status, response) {

			res.status(status).send({"message":"Participant " + req.param('participant_sid') + " added to conference " +  req.param('conference_sid') });

		});
	},

	/**
	* `ConferenceController.add_member`
	*/
	add_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

	
		sails.log.info('Method: add_member'); 

		console.log('Tenant ID:' + req.param('tenant_id'));

		var endpoint_number = '';

		if(req.param('member_phone').length >=10) {

			endpoint_number = sails.config.DIAL_PREFIX + req.param('member_phone');

		}
		else {

			endpoint_number = req.param('member_phone');

		}

		// Console Log
		//

		sails.log.info('Action: Prefix called number' + ' Result: Final Number to call. ' + endpoint_number + ' User: ' + req.session.username);

		//console.log(endpoint_number);

		var params = {
			'app': 'app_dars',
			'callerId': sails.config.CALLER_ID,
			//'endpoint': 'PJSIP/' + endpoint_number,// +  '@' + sails.config.EXT_SIP_TRUNK,
			'endpoint': 'PJSIP/' + endpoint_number +  '@' + sails.config.EXT_SIP_TRUNK,
			'appArgs':req.param('conference_sid') + ','+ 'participant' + ',' + req.session.username,
			'conference_sid': req.param('conference_sid'),
			'phone_number': req.param('member_phone'),
			'extension': req.param('extension'),
			'timeout': 120,
			'role': 'participant',
			'user_id': req.session.user_id,
			'username': req.session.username,
			'tenant_id': req.session.tenant_id,
			'announcer_sid': req.param('announcer_sid')
		};

		BridgeService.addParticipant(client,params, function (status, response) {

			if (response!=undefined && response.id!=undefined) {

				if (response.id.length > 2) {

					var res_params = {
						'statusCode': '200',
						'statusMessage': 'Participant added to the conference',
						'conference_sid': req.param('conference_sid'),
						'participant_sid': response.id
					}

					res.status(200).send(res_params);


				} else if (status == 400) {

					var res_params = {
						'statusCode': '400',
						'statusMessage': 'Invalid parameter for orginating a channel. Please consult IT Support',
						'conference_sid': req.param('conference_sid')
					}

					res.status(400).send(res_params);

				} else if (status == 409) {

					var res_params = {
						'statusCode': '409',
						'statusMessage': 'Channel already exist.',
						'conference_sid': req.param('conference_sid')
					}

					res.status(409).send(res_params);
				}
				else {

					var res_params = {
						'statusCode': '409',
						'statusMessage': 'Unknown error. Consult IT Support',
						'conference_sid': req.param('conference_sid')
					}

					res.status(409).send(res_params);

				}
			}
			else {

				var res_params = {
					'statusCode': '409',
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(409).send(res_params);

			}

		});

	},

	/**
	* `ConferenceController.get_member`
	*/
	get_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid')
		};

		ChannelService.get(client,params, function (status, response) {

			res.json(response);

		});

	},

	/**
	* `ConferenceController.hangup_member()`
	*/
	hangup_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		
		var params = {
			'channelId': req.param('participant_sid'),
			'reason': 'normal' /*Valid values are normal */
		};

		ChannelService.hangup(client,params, function (status, response) {

			if(status == 204){

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Participant dropped from the conference',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid')
				}

				res.status(200).send(res_params);

			} else if(status == 400){

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Invalid reason for hangup provided',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid')
				}

				res.status(status).send(res_params);

			} else if(status == 404) {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Channel not found.',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid')
				}

				res.status(status).send(res_params);

			}

		});
	},

	/**
	* `ConferenceController.hangup_all_member()`
	*/
	hangup_all_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};

		sails.log.info('In Hangup All');

		BridgeService.get(client,params,function(status,response){

			if(status == 200) {

				var channels = (response!==undefined) ? response.channels : [];

				sails.log.info(' BridgeService Get');
				sails.log.info(channels);

				channels.forEach(function(channel) {
					
					var find_params = {
						participant_sid: channel,
						role: 'announcer'
					};

					sails.log.info(find_params);

					TblConferencePartyModel.find(find_params).exec(function(err,conferenceMember) {

						sails.log.info(conferenceMember);

						var channel_params = {
							channelId: channel,
							reason: 'normal'
						};

						if(err) {
							
							sails.log.error(err);

						}
						else {

							if(conferenceMember.length===0) {

								ChannelService.hangup(client,channel_params, function (status, response) {

								});

							}
						}
					});

				});

				var hbridge_params = {
					'c_bridgeid': req.param('conference_sid')
				};

				BridgeService.onHoldHangup(client, hbridge_params, function (status, response) {

					var hbridge_params = {
						'c_bridgeid': req.param('conference_sid')
					};
					
					TblHoldingBridgeModel.destroy(hbridge_params).exec(function(err,conference) {

						if(!err){

							sails.log.info('Holding Bridge removed from the DB');
						}
						else {

							sails.log.error(err);
						}
					});

				});


				var res_params = {
					'statusCode': '200',
					'statusMessage': 'All participant hung up',
					'conference_sid': req.param('conference_sid'),
					'participants': channels
				}

				res.status(200).send(res_params);
			}
			else if(status == 404) {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Bridge not found',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}

		});
	},

	/**
	* `ConferenceController.play_member()`
	*/
	play_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid'),
			'media': req.param('media'),
			'lang': req.param('lang'),
			'offsetms': req.param('offsetms'),
			'skipms': req.param('skipms'),
			'playbackId': req.param('playbackId')
		};

		ChannelService.playMedia(client,params, function (status, response) {

			res.json(response);

		});

	},

	/**
	* `ConferenceController.deaf_member()`
	*/
	deaf_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid')
		};

		ChannelService.deaf(client,params, function (status, response) {

			res.json(response);

		});
	},


	/**
	* `ConferenceController.undeaf_member()`
	*/
	undeaf_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid')
		};

		ChannelService.undeaf(client,params, function (status, response) {

			res.json(response);

		});
	},


	/**
	* `ConferenceController.mute_member()`
	*/
	mute_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

                var mute_direction = req.param('direction');

                if (mute_direction == undefined) {

                   mute_direction = "both";
                }

		var params = {
			'channelId': req.param('participant_sid'),
			'direction': mute_direction	// Default is both  - Allowed values: both, in, out
		};

                //console.log(params);

		ChannelService.mute(client,params, function (status, response) {

			if(status == 204) {

				var res_params = {
					'statusCode': '204',
					'statusMessage': 'Participant Muted',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': mute_direction
				}
			       // console.log(res_params);
                    res.status(200).send(res_params);
				//res.json(res_params);

			}
			else if(status == 404) {

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Participant not found',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': mute_direction
				}

				res.status(status).send(res_params);
			}
			else if(status == 409) {

				var res_params = {
					'statusCode': '409',
					'statusMessage': 'Participant not found in the application',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': mute_direction
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': mute_direction
				}

				res.status(status).send(res_params);

			}

		});

	},
	/**
	* `ConferenceController.muteall_member()`
	*/
	muteall_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};


		var mute_direction = req.param('direction');

		if (mute_direction == undefined) {

		   mute_direction = "both";
		}

		sails.log.info(' In Mute All ');
		sails.log.info(' Conference SID: ' + req.param('conference_sid') + ' Mute Direction ' + req.param('direction'));

		BridgeService.get(client,params,function(status,response){

			if(status == 200) {

				var channels = (response!==undefined) ? response.channels : {};
				
				channels.forEach(function(channel) {

					var channel_params = {
						'channelId': channel,
						'direction': mute_direction
					};

					var find_params = {
						'participant_sid': channel,
						'role': 'announcer'
					};

					TblConferencePartyModel.find(find_params).exec(function(err,conferenceMember) {

						if(err) {

							sails.log.error(err);
						}
						else {

							if(conferenceMember.length == 0) {

								ChannelService.mute(client,channel_params, function (status, response) {
								
									sails.log.info(' Participant SID: ' + channel + ' Muted');
								});
	
							}
						}
						

					});

				});

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'All participants muted',
					'conference_sid': req.param('conference_sid'),
					'participants': channels,
					'direction': mute_direction
				}

				res.status(200).send(res_params);
			}
			else if(status == 404) {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Bridge not found',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}

		});

	},
	/**
	* `ConferenceController.unmuteall_member()`
	*/
	unmuteall_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};

		var mute_direction = req.param('direction');

		if (mute_direction == undefined) {

		   mute_direction = "both";
		}

		sails.log.info(' In Unmute All ');
		sails.log.info(' Conference SID: ' + req.param('conference_sid') + ' Unmute Direction ' + req.param('direction'));


		BridgeService.get(client,params,function(status,response){

			if(status == 200) {

				var channels = (response!==undefined) ? response.channels : {};

				channels.forEach(function(channel) {

					var channel_params = {
						'channelId': channel,
						'direction': mute_direction
					};

					var find_params = {
						'participant_sid': channel,
						'role': 'announcer'
					};

					sails.log.info(find_params);

					TblConferencePartyModel.find(find_params).exec(function(err,conferenceMember) {

						sails.log.info(conferenceMember);

						if(err) {

							sails.log.error(err);
						}
						else {

							if(conferenceMember.length == 0) {

								ChannelService.unmute(client,channel_params, function (status, response) {
									
									sails.log.info(' Participant SID: ' + channel + ' Unmuted');

								});
	
							}
						}
						

					});

				});

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'All participants unmuted',
					'conference_sid': req.param('conference_sid'),
					'participants': channels,
					'direction': mute_direction
				}

				res.status(200).send(res_params);
			}
			else if(status == 404) {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Bridge not found',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}

		});

	},

	/**
	* `ConferenceController.unmute_member()`
	*/
	unmute_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var unmute_direction = req.param('direction');

		if (unmute_direction == undefined) {

			unmute_direction = "both";
		}

		var params = {
			'channelId': req.param('participant_sid'),
			'direction': unmute_direction	// Default is both  - Allowed values: both, in, out
		};

                //console.log("Unmute\n");
                //console.log(params);
		ChannelService.unmute(client,params, function (status, response) {


			if(status == 204) {

				var res_params = {
					'statusCode': '204',
					'statusMessage': 'Participant Unmuted',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': req.param('direction')
				}
			    //console.log(res_params);
				res.status(200).send(res_params);

			}
			else if(status == 404) {

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Participant not found',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': req.param('direction')
				}

				res.status(status).send(res_params);
			}
			else if(status == 409) {

				var res_params = {
					'statusCode': '409',
					'statusMessage': 'Participant not found in the application',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': req.param('direction')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'direction': req.param('direction')
				}

				res.status(status).send(res_params);

			}

		});
	},


	/**
	* `ConferenceController.kick_member()`
	*/
	kick_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid'),
			'reason': req.param('reason')
		};

		ChannelService.hangup(client,params, function (status, response) {

			res.json(response);

		});
	},


	/**
	* `ConferenceController.hold_member()`
	*/
	hold_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'name': req.session.username + '_' + req.param('conference_sid') + '_holding',
			'type': 'holding'
		};

		TblConferencePartyModel.update({participant_sid:req.param('participant_sid')},{state:'hold'}).exec(function(err,participant) {
			
			if(err) {
				
				sails.log.error(err);
				
				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Participant hold failed',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid')
				};

				res.status(404).send(res_params);
			}
			else {

				BridgeService.create(client,params,function(error,response){

					var hold_bridgeId = '';

					if(err){

						sails.log.error(error);

						var res_params = {
							'statusCode': '404',
							'statusMessage': 'Participant hold failed',
							'conference_sid': req.param('conference_sid'),
							'participant_sid': req.param('participant_sid'),
							'hold_conference_sid': hold_bridgeId
						};

						res.status(404).send(res_params);
					}
					else {

						if(response!=undefined) {

							hold_bridgeId = response.id;

							var hold_params = {
								'bridgeId': hold_bridgeId
							};

							var channel_params = {
								'bridgeId': req.param('conference_sid'),
								'channel': req.param('participant_sid')
							};

							BridgeService.removeChannel(client, channel_params, function (status, response) {

								var hold_params = {
									'bridgeId': hold_bridgeId,
									'channel': req.param('participant_sid')
								};
		
								BridgeService.addChannel(client, hold_params, function (status, response) {
		
									var channel_params = {
										'channelId': req.param('participant_sid')
									};
		
									ChannelService.startMohChannel(client, channel_params, function (status, response) {
		
										//console.log('Started MOH on Channel');
		
									});
		
									var res_params = {
										'statusCode': '200',
										'statusMessage': 'Participant put on hold',
										'conference_sid': req.param('conference_sid'),
										'participant_sid': req.param('participant_sid'),
										'hold_conference_sid': hold_bridgeId
									};
		
									res.status(200).send(res_params);

									var hbridge_params = {
										'h_bridgeid': hold_bridgeId,
										'c_bridgeid': req.param('conference_sid')
									};

									TblHoldingBridgeModel.create(hbridge_params).exec(function(err,conference) {

										if(!err){

											sails.log.info('Holding Bridge Added to the DB');
										}
										else {

											sails.log.error(err);
										}
									});
								});
		
							});
						}
					}
				});
			}
		});



	},
	/**
	* `ConferenceController.unhold_member()`
	*/
	unhold_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var remove_params = {
			'bridgeId': req.param('hold_conference_sid'),
			'channel': req.param('participant_sid')
		};

		TblConferencePartyModel.update({participant_sid:req.param('participant_sid')},{state:'unhold'}).exec(function(err,participant) {
			
			if(err) {

				sails.log.error(err);

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Participant unhold failed',
					'conference_sid': req.param('conference_sid'),
					'participant_sid': req.param('participant_sid'),
					'hold_conference_sid': req.param('hold_conference_sid')
				};

				res.status(404).send(res_params);

			}
			else {

				var channel_params = {
					'channelId': req.param('participant_sid')
				};

				ChannelService.stopMohChannel(client,channel_params, function (status, response) {

					BridgeService.removeChannel(client,remove_params, function (status, response) {


						var add_params = {
							'bridgeId': req.param('conference_sid'),
							'channel': req.param('participant_sid')
						};
	
						BridgeService.addChannel(client,add_params, function (status, response) {
	
							var res_params = {
								'statusCode': '200',
								'statusMessage': 'Participant retrieve from hold',
								'conference_sid': req.param('conference_sid'),
								'participant_sid': req.param('participant_sid')
							};
	
							var params = {
								'bridgeId': req.param('hold_conference_sid')
							};
	
							BridgeService.hangup(client, params, function (status, response) {
	
								var hbridge_params = {
									'h_bridgeid': req.param('hold_conference_sid')
								};
		
								TblHoldingBridgeModel.destroy(hbridge_params).exec(function(err,conference) {
		
									if(!err){
		
										sails.log.info('Holding Bridge removed from the DB');
									}
									else {
		
										sails.log.error(err);
									}
								});

							});
	
							res.status(200).send(res_params);
						});
	
					});

				});

			}
		});
	},

	/**
	* `ConferenceController.hold_all_member()`
	*/
	hold_all_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('conference_sid')
		};

		//console.log("Main Conference ID: " + req.param('conference_sid'));

		var holding_params = {
			'name': req.session.username + '_' + req.param('conference_sid') + '_holding',
			'type': 'holding'
		};

		sails.log.info(' In Hold All ');
		sails.log.info(' Conference SID: ' + req.param('conference_sid') + ' Holding Bridge Name ' + holding_params['name']);

		BridgeService.create(client,holding_params,function(error,response){

			var hold_bridgeId = (response!==undefined) ? response.id : '';

			sails.log.info(' Holding Bridge ID ' + hold_bridgeId);

			BridgeService.get(client,params,function(status,response){
				

				if(status == 200) {

					var channels = response.channels;

					var itemProcessed = 0;

					channels.forEach(function(channel) {

						var find_params = {
							'participant_sid': channel,
							'role': 'announcer'
						};

						TblConferencePartyModel.find(find_params).exec(function(err,conferenceMember) {

							if(err){

								sails.log.info(err);
							}
							else{

								if(conferenceMember.length == 0) {

									TblConferencePartyModel.update({participant_sid:channel},{state:'hold'}).exec(function(err,participant) {

										var remove_params = {
											'bridgeId': req.param('conference_sid'),
											'channel': channel
										};
									

										BridgeService.removeChannel(client,remove_params, function (status, response) {
											
											sails.log.info(' Remove Channel ' + channel + ' From Conference Bridge ' + req.param('conference_sid'));

											var add_params = {
												'bridgeId': hold_bridgeId,
												'channel': channel
											};
	
											BridgeService.addChannel(client,add_params, function (status, response) {
												
												sails.log.info(' Add Channel ' + channel + ' To  Holding Bridge ' + hold_bridgeId);

												var channel_params = {
													'channelId': channel
												};
					
												ChannelService.startMohChannel(client, channel_params, function (status, response) {
													
													sails.log.info(' Started Music on Hold for ' + channel);

													//console.log('Started MOH on Channel');
					
												});
	
											});
										});
	
									});

								}

							}

						});

						itemProcessed++;

						if(itemProcessed===channels.length){

							var hbridge_params = {
								'h_bridgeid': hold_bridgeId,
								'c_bridgeid': req.param('conference_sid')
							};
		
							TblHoldingBridgeModel.create(hbridge_params).exec(function(err,conference) {
		
								if(!err){
		
									sails.log.info('Holding Bridge Added to the DB');
								}
								else {
		
									sails.log.error(err);
								}
							});

						}
					});

					var res_params = {
						'statusCode': '200',
						'statusMessage': 'Participants put on hold',
						'conference_sid': req.param('conference_sid'),
						'participants': channels,
						'hold_conference_sid': hold_bridgeId
					};

					res.status(200).send(res_params);
				}
				else if(status == 404) {

					var res_params = {
						'statusCode': status,
						'statusMessage': 'Bridge not found',
						'conference_sid': req.param('conference_sid')
					}

					res.status(status).send(res_params);
				}
				else {

					var res_params = {
						'statusCode': status,
						'statusMessage': 'Unknown error. Consult IT Support',
						'conference_sid': req.param('conference_sid')
					}

					res.status(status).send(res_params);
				}

			});

		});

	},

	/**
	* `ConferenceController.unhold_all_member()`
	*/
	unhold_all_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'bridgeId': req.param('hold_conference_sid')
		};

		//console.log("Holding Bridge ID - Unhold: " + req.param('hold_conference_sid'));

		sails.log.info(' In Hold All ');
		sails.log.info(' Conference SID: ' + req.param('conference_sid') + ' Holding Bridge Id ' + req.param('hold_conference_sid'));

		BridgeService.get(client,params,function(status,response){

			if(status == 200) {

				var channels = (response!==undefined) ? response.channels : {};

				var itemProcessed = 0;

				channels.forEach(function(channel) {

					var find_params = {
						'participant_sid': channel,
						'role': 'announcer'
					};

					TblConferencePartyModel.find(find_params).exec(function(err,conferenceMember) {

						if(err){

							sails.log.info(err);
						}
						else{

							if(conferenceMember.length == 0) {

								TblConferencePartyModel.update({participant_sid:channel},{state:'unhold'}).exec(function(err,participant) {

									var channel_params = {
										'channelId': channel
									};
		
									ChannelService.stopMohChannel(client, channel_params, function (status, response) {
		
										sails.log.info(' Stop MOH on Channel ' + channel + ' Holding Bridge ' + req.param('hold_conference_sid'));
	
										var remove_params = {
											'bridgeId': req.param('hold_conference_sid'),
											'channel': channel
										};
	
										BridgeService.removeChannel(client,remove_params, function (status, response) {
											
											sails.log.info(' Remove Channel ' + channel + ' From Holding Bridge ' + req.param('hold_conference_sid'));

											var add_params = {
												'bridgeId': req.param('conference_sid'),
												'channel': channel
											};
											

											BridgeService.addChannel(client,add_params, function (status, response) {
												
												sails.log.info(' Add Channel ' + channel + ' To Conference Bridge ' + req.param('conference_sid'));
		
											});
		
										});
		
									});
									
								});

							}
						}
					});

					itemProcessed++;

					if(itemProcessed===channels.length){

						var hangup_params = {
							'bridgeId': req.param('hold_conference_sid')
						};
		
		
						BridgeService.hangup(client,hangup_params, function (status, response) {

							var hbridge_params = {
								'h_bridgeid': req.param('hold_conference_sid')
							};
	
							TblHoldingBridgeModel.destroy(hbridge_params).exec(function(err,conference) {
	
								if(!err){
	
									sails.log.info('Holding Bridge removed from the DB');
								}
								else {
	
									sails.log.error(err);
								}
							});
		
						});

					}
				
				});

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Participants retrieved from hold',
					'conference_sid': req.param('conference_sid'),
					'participants': channels
				};

				res.status(200).send(res_params);

			}
			else if(status == 404) {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Bridge not found',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}
			else {

				var res_params = {
					'statusCode': status,
					'statusMessage': 'Unknown error. Consult IT Support',
					'conference_sid': req.param('conference_sid')
				}

				res.status(status).send(res_params);
			}

		});

	},

	/**
	* `ConferenceController.start_moh_member()`
	*/
	start_moh_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid'),
			'mohClass': req.param('mohClass')
		};

		ChannelService.startMohChannel(client,params, function (status, response) {

			res.json(response);

		});
	},


	/**
	* `ConferenceController.stop_moh_member()`
	*/
	stop_moh_member: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid')
		};

		ChannelService.stopMohChannel(client,params, function (status, response) {

			res.json(response);

		});
	},
	/**
	* `ConferenceController.sendDTMF()`
	*/
	sendDTMF: function (req, res) {

		var client = globly.RestAPI({
			authId: sails.config.API_KEY,
			authToken: sails.config.API_SECRET
		});

		var params = {
			'channelId': req.param('participant_sid'),
			'dtmf': req.param('dtmf_digits')
		};

		sails.log.info(' User ' + req.session.username + ' Entered DTMF ' + req.param('dtmf_digits') + ' Participant SID ' + req.param('participant_sid'));

		ChannelService.sendDTMFChannel(client,params, function (status, response) {

			sails.log.info(' User ' + req.session.username + ' Status from sendDTMFChannel ' + status);
			
			console.log(response);

			res.json(response);

		});
	},

	/**
	* `ConferenceController.addDisposition()`
	*/
	addDisposition: function (req, res) {

		var params = {
			'user_id': req.param('user_id'),
			'tenant_id': req.param('tenant_id'),
			'conference_sid': req.param('conference_sid'),
			'code': req.param('code'),
			'name': req.param('name')
		};

		console.log(params);

		BridgeService.addDisposition(params, function (status, response) {

			res.status(status).send(response);

		});

		
	},

	/**
	* `ConferenceController.addRecTag()`
	*/
	addRecTag: function (req, res) {

		var params = {
			'user_id': req.param('user_id'),
			'tenant_id': req.param('tenant_id'),
			'conference_sid': req.param('conference_sid'),
			'label': req.param('label'),
			'description': req.param('description'),
			'taggedat': req.param('taggedat')
		};

		console.log(params);

		TblRecordingsTagModel.create(params).exec(function (error, tagResponse) {

			if (error) {

				sails.log.error(error);

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Tag not created'
				}

				res.status(404).send(res_params);

			}
			else {

				sails.log.info(' Recording tag created');

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Tag created'
				}

				res.status(200).send(res_params);

			}


		});
		
	}
};

