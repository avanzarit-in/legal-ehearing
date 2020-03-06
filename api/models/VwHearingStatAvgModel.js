/**
 * VwHearingsModel.js
 *
 * @description :: All hearing data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'EHEARING_DB',
    tableName: 'VW_HEARING_STATAVG',
    attributes: {
        id: {
            'type': 'integer',
            columnName: 'ID'
        },
        user_id: {
            'type': 'integer',
            columnName: 'USER_ID'
        },
        tenant_id: {
            'type': 'integer',
            columnName: 'TENANT_ID'
        },
        user_name: {
            'type': 'string',
            columnName: 'USER_NAME'
        },
        week: {
            'type': 'string',
            columnName: 'WEEK'
        },
        month: {
            'type': 'string',
            columnName: 'MONTH'
        },
        quarter: {
            'type': 'string',
            columnName: 'QUARTER'
        },
        year: {
            'type': 'string',
            columnName: 'YEAR'
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

