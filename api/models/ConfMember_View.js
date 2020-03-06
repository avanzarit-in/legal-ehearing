/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'CONFMEMBER_VIEW',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	user_id:{
		'type': 'string',
		columnName: 'USER_ID'
	},
	docket_number:{
		'type': 'string',
		columnName: 'DOCKET_NUMBER'
	},
	conference_sid:{
		'type': 'string',
		columnName: 'CONFERENCE_SID'
	},
	participant_sid:{
		'type': 'string',
		columnName: 'PARTICIPANT_SID'
	},
	announcer_sid:{
		'type': 'string',
		columnName: 'ANNOUNCER_SID'
	},
	call_to:{
		'type':'string',
		columnName: 'CALL_TO'
	},
	role:{
		'type':'string',
		columnName: 'ROLE'
	},
	state:{
		'type':'string',
		columnName: 'STATE'
	},
	dialstatus:{
		'type':'string',
		columnName: 'DIALSTATUS'
	},
	cause:{
		'type':'string',
		columnName: 'CAUSE'
	},
	cause_txt:{
		'type':'string',
		columnName: 'CAUSE_TXT'
	}
  }
};

