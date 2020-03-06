/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'CONFERENCEMEMBER',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	participant_sid:{
		'type': 'string',
		columnName: 'PARTICIPANT_SID'
	},
	conference_sid:{
		'type': 'string',
		columnName: 'CONFERENCE_SID'
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

