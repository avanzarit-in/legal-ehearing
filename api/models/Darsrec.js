/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'callrec_db',
  tableName: 'DARSREC',
  attributes: {
		id:{
			'type':'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		cplid: {
			'type':'number',
			columnName: 'CPLID'
		},
		gen_connid:{
			'type': 'string',
			columnName: 'GEN_CONNID'
		},
		cfpath: {
			'type':'string',
			columnName: 'CFPATH'
		},
		start_ts: {
			'type':'string',
			columnName: 'START_TS'
		}
  }
};

