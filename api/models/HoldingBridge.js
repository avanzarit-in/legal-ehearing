/**
 * Conference.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'HOLDINGBRIDGE',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	h_bridgeid:{
		'type': 'string',
		unique: true,
		columnName: 'H_BRIDGEID'
	},
	c_bridgeid:{
		'type': 'string',
		columnName: 'C_BRIDGEID'
	}
  }
};

