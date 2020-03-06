/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'USERSESSION',
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
		place: {
			'type':'string',
			columnName: 'PLACE'
		},
		state: {
			'type':'string',
			columnName: 'STATE'
		},
		browser: {
			'type':'string',
			columnName: 'BROWSER'
		},
		host: {
			'type':'string',
			columnName: 'HOST'
		},
		sessionid: {
			'type':'string',
			columnName: 'SESSIONID'
		}

  }
};

