/**
 * Accounts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	connection: 'dars_db',
	tableName: 'WSSESSION',
	attributes: {
		id: {
			'type': 'integer',
			unique: true,
			primaryKey: true,
			autoIncrement: true,
			columnName: 'ID'
		},
		ipaddress: {
			'type': 'string',
			columnName: 'IPADDRESS'
		},
		status: {
			'type': 'string',
			columnName: 'STATUS'
		}
	}
};

