/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'ACTIVECONF_VIEW',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	user_id:{
		'type':'string',
		columnName: 'USER_ID'
	},
	conference_sid:{
		'type': 'string',
		columnName: 'CONFERENCE_SID'
	},
	name:{
		'type':'string',
		columnName: 'NAME'
	},
	docket_number:{
		'type':'string',
		columnName: 'DOCKET_NUMBER'
	},
	status:{
		'type':'string',
		columnName: 'STATUS'
	},
	createdAt:{
		'type':'string',
		columnName: 'CREATEDAT'
	},
	updatedAt:{
		'type':'string',
		columnName: 'UPDATEDAT'
	}
  }
};

