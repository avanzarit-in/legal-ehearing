/**
 * Recordings_View.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'dars_db',
	tableName: 'RECORDINGS_VIEW',
	attributes: {
		id: {
			'type': 'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		mediasrvip: {
			'type': 'string',
			columnName: 'MEDIASRVIP'
		},
		conference_sid: {
			'type': 'string',
			columnName: 'CONFERENCE_SID'
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
		record_name: {
			'type': 'string',
			columnName: 'RECORD_NAME'
		},
		record_dt: {
			'type': 'string',
			columnName: 'RECORD_DT'
		},
		record_time: {
			'type': 'string',
			columnName: 'RECORD_TIME'
		},
		cfpath: {
			'type': 'string',
			columnName: 'CFPATH'
		},
		status: {
			'type': 'string',
			columnName: 'STATUS'
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

