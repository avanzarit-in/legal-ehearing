/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'USERS',
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
		first_name: {
			'type':'string',
			columnName: 'FIRST_NAME'
		},
		last_name: {
			'type':'string',
			columnName: 'LAST_NAME'
		},
		status: {
			'type':'integer',
			columnName: 'STATUS'
		},
		location: {
			'type':'string',
			columnName: 'LOCATION'
		},
		role: {
			'type':'string',
			columnName: 'ROLE'
		}
  }
};

