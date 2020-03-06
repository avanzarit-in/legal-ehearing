/**
 * TblConferenceModel.js
 *
 * @description :: All conference goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'EHEARING_DB',
  tableName: 'TBL_CONFERENCE',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	tenant_id:{
		'type': 'integer',
		columnName: 'TENANT_ID'
	},
	user_id:{
		'type': 'integer',
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
	name:{
		'type': 'string',
		columnName: 'NAME'
	},
	bridge_type:{
		'type': 'string',
		columnName: 'BRIDGE_TYPE'
	},
	status:{
		'type': 'string',
		columnName: 'STATUS'
	},
	direction:{
		'type': 'string',
		columnName: 'DIRECTION'
	},
	disposition_code:{
		'type': 'string',
		columnName: 'DISPOSITION_CODE'
	},
	duration:{
		'type': 'string',
		columnName: 'DURATION'
	}
  }
};

