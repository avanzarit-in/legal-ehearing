/**
 * Events.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'EVENTS',
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
		event_type:{
			'type': 'string',
			columnName: 'EVENT_TYPE'
		},
		event_body:{
			'type': 'string',
			'size': 1000,
			columnName: 'EVENT_BODY'
		}
  }
};

