/**
 * Conference.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'CONFERENCE',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	conference_sid:{
		'type': 'string',
		unique: true,
		columnName: 'CONFERENCE_SID'
	},
	user_id:{
		'type': 'string',
		columnName: 'USER_ID'
	},
	application:{
		'type': 'string',
		columnName: 'APPLICATION'
	},
	bridge_type:{
		'type': 'string',
		columnName: 'BRIDGE_TYPE'
	},
	name:{
		'type': 'string',
		columnName: 'NAME'
	},
	channels:{
		'type': 'string',
		columnName: 'CHANNELS'
	},
	docket_number:{
		'type': 'string',
		columnName: 'DOCKET_NUMBER'
	},
	status:{
		'type': 'string',
		columnName: 'STATUS'
	},
	duration:{
		'type': 'string',
		columnName: 'DURATION'
	},
	gen_connid:{
		'type': 'string',
		columnName: 'GEN_CONNID'
	}
  }
};

