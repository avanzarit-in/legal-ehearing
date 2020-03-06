/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'dars_db',
	tableName: 'RECCONV_TEMP_VIEW',
	attributes: {
		id: {
			'type': 'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		gen_connid: {
			'type': 'string',
			columnName: 'GEN_CONNID'
		},
		docket_number: {
			'type': 'string',
			columnName: 'DOCKET_NUMBER'
		},
		issue_id: {
			'type': 'string',
			columnName: 'ISSUE_ID'
		},
		issue_seq_num: {
			'type': 'string',
			columnName: 'ISSUE_SEQ_NUM'
		},
		record_dt: {
			'type': 'string',
			columnName: 'RECORD_DT'
		},
		record_time: {
			'type': 'string',
			columnName: 'RECORD_TIME'
		},
		duration: {
			'type': 'string',
			columnName: 'DURATION'
		},
		status: {
			'type': 'string',
			columnName: 'STATUS'
		},
		cfpath: {
			'type': 'string',
			columnName: 'CFPATH'
		},
		cplid: {
			'type': 'integer',
			columnName: 'CPLID'
		},
		filename: {
			'type': 'string',
			columnName: 'FILENAME'
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

