// api/services/ChannelService.js

const globly = require('globly');

module.exports = {
	
	/**
   * `ChannelService.getAllChannels()`
   */
	getAllChannels: function (client,params,callback) {
		
		client.list_active_channels(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.get`
	*/
	
	get: function(client,params,callback) {
				
		client.get_channel(params, function (status, response) {
						
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.create`
	*/
	create: function (client,params, callback) {
    
		
		client.create_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	/**
	* `ChannelService.originate`
	*/
	originate: function (client,params,callback) {
		
		console.log(params);
		
		client.originate_channel(params,function (status, response) {
			
			callback(status,response);
			
		});
	},

	/**
	* `ChannelService.originate_channel_withId`
	*/
	originate_withId: function (client,params, callback) {
    
		
		client.originate_channel_withId(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	/**
	* `ChannelService.dial()`
	*/
	dial: function (client,params, callback) {
		
		client.dial_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	/**
	* `ChannelService.hangupChannel()`
	*/
	hangup: function (client,params,callback) {
    		
		client.hangup_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.redirectChannel()`
	*/
	redirectChannel: function (client,params,callback) {
		
		client.redirect_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.answerChannel()`
	*/
	answerChannel: function (client,params,callback) {
	
		client.answer_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.ringChannel()`
	*/
	ringChannel: function (client,params,callback) {
    
		client.ring_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.ringStopChannel()`
	*/
	ringStopChannel: function (client,params,callback) {
    
		client.ring_stop_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.sendDTMFChannel()`
	*/
	sendDTMFChannel: function (client,params,callback) {
    
		client.send_dtmf_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.mute()`
	*/
	mute: function (client,params, callback) {
		
		client.mute_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.unmute()`
	*/
	unmute: function (client,params, callback) {
    
		client.unmute_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.holdChannel()`
	*/
	hold: function (client,params, callback) {
		
		client.hold_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.unholdChannel()`
	*/
	unhold: function (client,params, callback) {
    
		client.unhold_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.startMohChannel()`
	*/
	startMohChannel: function (client,params, callback) {
				
		client.start_moh_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.stopMohChannel()`
	*/
	stopMohChannel: function (client,params, callback) {
    	
		client.stop_moh_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.deafChannel()`
	*/
	deaf: function (client,params, callback) {
		
		client.start_silence_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},


	/**
	* `ChannelService.undeafChannel()`
	*/
	undeaf: function (client,params, callback) {
		
		client.stop_silence_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.playMediaChannel()`
	*/
	playMedia: function (client,params, callback) {
		
		client.play_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	/**
	* `ChannelService.playMediaWithId()`
	*/
	playMediaWithId: function (client,params, callback) {
		
		client.play_channel_withId(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.recordChannel()`
	*/
	recordChannel: function (client,params, callback) {
		
		client.record_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.snoopChannel()`
	*/
	snoopChannel: function (client,params, callback) {
    
		client.snoop_channel(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	/**
	* `ChannelService.setVariable()`
	*/
	setVariable: function (client,params, callback) {
				
		client.set_variable(params, function (status, response) {
			
			callback(status,response);
			
		});
	},
	
	/**
	* `ChannelService.getVariable()`
	*/
	getVariable: function (client,params, callback) {
    	
		client.get_variable(params, function (status, response) {
			
			callback(status,response);
			
		});
	},

	
};
