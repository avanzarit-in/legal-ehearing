/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'dars_db',
  tableName: 'APPEALSMEMBER',
  attributes: {
    id:{
		'type':'integer',
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		columnName: 'ID'
	},
	docket_number: {
		'type':'string',
		columnName: 'DOCKET_NUMBER'
	},
	partyType_cd:{
		'type':'string',
		columnName: 'PARTYTYPE_CD'
	},
	partyType_desc:{
		'type':'string',
		columnName: 'PARTYTYPE_DESC'
	},
	party_id:{
		'type':'string',
		columnName: 'PARTY_ID'
	},
	first_name:{
		'type':'string',
		columnName: 'FIRST_NAME'
	},
	middle_name:{
		'type':'string',
		columnName: 'MIDDLE_NAME'
	},
	last_name:{
		'type':'string',
		columnName: 'LAST_NAME'
	},
	business_name:{
		'type':'string',
		columnName: 'BUSINESS_NAME'
	},
	phone_number:{
		'type':'string',
		columnName: 'PHONE_NUMBER'
	},
	extension:{
		'type':'string',
		columnName: 'EXTENSION'
	}
  }
};

