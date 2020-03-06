/**
 * Hearing.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'HEARING',
  attributes: {
	id:{
		'type':'integer',
		columnName: 'ID'
	},
    name:{
		'type': 'string',
		columnName: 'NAME'
	},
	filename:{
		'type': 'string',
		columnName: 'FILENAME'
	},
    user_id:{
		'type': 'string',
		columnName: 'USER_ID'
	},
	first_name:{
		'type': 'string',
		columnName: 'FIRST_NAME'
	},
	last_name:{
		'type': 'string',
		columnName: 'LAST_NAME'
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
	scheduled_dt:{
		'type':'datetime',
		columnName: 'SCHEDULED_DT'
	},
	scheduled_time:{
		'type':'datetime',
		columnName: 'SCHEDULED_TIME'
	},
	start_dt:{
		'type':'datetime',
		columnName: 'START_DT'
	},
	start_time:{
		'type':'datetime',
		columnName: 'START_TIME'
	},
	site_location:{
		'type':'string',
		columnName: 'SITE_LOCATION'
	},
	claim_type_cd:{
		'type':'string',
		columnName: 'CLAIM_TYPE_CD'
	},
	claim_type_desc:{
		'type':'string',
		columnName: 'CLAIM_TYPE_DESC'
	},
	hearing_status:{
		'type': 'string',
		columnName: 'HEARING_STATUS'
	},
	duration:{
		'type': 'string',
		columnName: 'DURATION'
	},
	adherence_status:{
		'type': 'string',
		columnName: 'ADHERENCE_STATUS'
	},
	adherence_deviation:{
		'type': 'integer',
		columnName: 'ADHERENCE_DEVIATION'
	}
  }
};

