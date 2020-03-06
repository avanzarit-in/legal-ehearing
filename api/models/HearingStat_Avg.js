/**
 * Hearing.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'CONFERENCE_WMY_AVG_VIEW',
  attributes: {
	id:{
		'type':'integer',
		columnName: 'ID'
	},
    user_id:{
		'type': 'string',
		columnName: 'USER_ID'
	},
	week:{
		'type': 'string',
		columnName: 'WEEK'
	},
	month:{
		'type': 'string',
		columnName: 'MONTH'
	},
	quarter: {
		'type':'string',
		columnName: 'QUARTER'
	},
	year:{
		'type':'string',
		columnName: 'YEAR'
	}
  }
};

