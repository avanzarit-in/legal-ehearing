/**
 * Conference.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'APPEALS_VIEW',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	docket_number: {
		'type':'string',
		columnName: 'DOCKET_NUMBER'
	},
	issue_id:{
		'type':'string',
		columnName: 'ISSUE_ID'
	},
	issue_seq_num:{
		'type':'string',
		columnName: 'ISSUE_SEQ_NUM'
	},
	name:{
		'type': 'string',
		columnName: 'NAME'
	},
	user_id:{
		'type': 'string',
		columnName: 'USER_ID'
	},
	first_name:{
		'type': 'string',
		columnName: 'FIRST_NAME'
	},
	middle_name:{
		'type': 'string',
		columnName: 'MIDDLE_NAME'
	},
	last_name:{
		'type': 'string',
		columnName: 'LAST_NAME'
	},
	status:{
		'type': 'string',
		columnName: 'STATUS'
	},
	claim_type_cd:{
		'type':'string',
		columnName: 'CLAIM_TYPE_CD'
	},
	claim_type_desc:{
		'type':'string',
		columnName: 'CLAIM_TYPE_DESC'
	},
	site_location:{
		'type':'string',
		columnName: 'SITE_LOCATION'
	},
	scheduled_dt:{
		'type':'datetime',
		columnName: 'SCHEDULED_DT'
	},
	scheduled_time:{
		'type':'datetime',
		columnName: 'SCHEDULED_TIME'
	},
	createdAt:{
		'type':'datetime',
		columnName: 'CREATEDAT'
	},
	updatedAt:{
		'type':'datetime',
		columnName: 'UPDATEDAT'
	}
  }
};

