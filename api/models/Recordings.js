/**
 * Recordings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'dars_db',
	tableName: 'RECORDINGS',
	attributes: {
		id: {
			'type': 'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		conference_sid: {
			'type': 'string',
			columnName: 'CONFERENCE_SID'
		},
		mediasrvip: {
			'type': 'string',
			columnName: 'MEDIASRVIP'
		},
		cfpath: {
			'type': 'string',
			columnName: 'CFPATH'
		},
		record_name: {
			'type': 'string',
			columnName: 'RECORD_NAME'
		},
		filename: {
			'type': 'string',
			columnName: 'FILENAME'
		},
		record_dt: {
			'type': 'string',
			columnName: 'RECORD_DT'
		},
		record_time: {
			'type': 'string',
			columnName: 'RECORD_TIME'
		},
		recording_state: {
			'type': 'string',
			columnName: 'RECORDING_STATE'
		},
		status: {
			'type': 'string',
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