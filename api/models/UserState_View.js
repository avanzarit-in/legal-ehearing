/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  	connection: 'dars_db',
  	tableName: 'USERSTATE_VIEW',
  	attributes: {
		id:{
			'type':'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		username:{
			'type': 'string',
			columnName: 'USERNAME'
		},
		first_name:{
			'type': 'string',
			columnName: 'FIRST_NAME'
		},
		last_name:{
			'type': 'string',
			columnName: 'LAST_NAME'
		},
		place: {
			'type':'string',
			columnName: 'PLACE'
		},
		state: {
			'type':'string',
			columnName: 'STATE'
		},
		login_date:{
			'type':'datetime',
			columnName: 'LOGIN_DATE'
		},
		login_time:{
			'type':'datetime',
			columnName: 'LOGIN_TIME'
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

