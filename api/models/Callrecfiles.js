/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'dars_db',
	tableName: 'CALLRECFILES',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: {
			'type': 'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		cplid: {
			'type': 'integer',
			columnName: 'CPLID'
		},
		gen_connid: {
			'type': 'string',
			columnName: 'GEN_CONNID'
		},

		cfpath: {
			'type': 'string',
			columnName: 'CFPATH'
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
			'type': 'integer',
			columnName: 'DURATION'
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