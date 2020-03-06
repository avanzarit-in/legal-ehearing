/**
 * Conference.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'USER_APPEALS_STAT',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
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
	hearing_dt:{
		'type': 'string',
		columnName: 'HEARING_DT'
	},
	completed:{
		'type':'string',
		columnName: 'COMPLETED'
	},
	IN_PROGRESS:{
		'type':'string',
		columnName: 'IN_PROGRESS'
	},
	TOTAL_APPEALS:{
		'type':'string',
		columnName: 'TOTAL_APPEALS'
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

