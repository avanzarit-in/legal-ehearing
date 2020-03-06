/**
 * VwHearingsModel.js
 *
 * @description :: All hearing data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'EHEARING_DB',
    tableName: 'VW_HEARINGS',
    attributes: {
        id: {
            'type': 'integer',
            columnName: 'ID'
        },
        tenant_id: {
            'type': 'integer',
            columnName: 'TENANT_ID'
        },
        user_id: {
            'type': 'integer',
            columnName: 'USER_ID'
        },
        username: {
            'type': 'string',
            columnName: 'USERNAME'
        },
        first_name: {
            'type': 'string',
            columnName: 'FIRST_NAME'
        },
        last_name: {
            'type': 'string',
            columnName: 'LAST_NAME'
        },
        site_id: {
            'type': 'integer',
            columnName: 'SITE_ID'
        },
        site_location: {
            'type': 'string',
            columnName: 'SITE_LOCATION'
        },
        docket_number: {
            'type': 'string',
            columnName: 'DOCKET_NUMBER'
        },
        issue_id: {
            'type': 'string',
            columnName: 'ISSUE_ID'
        },
        issue_seq_num: {
            'type': 'string',
            columnName: 'ISSUE_SEQ_NUM'
        },
        name: {
            'type': 'string',
            columnName: 'NAME'
        },
        code: {
            'type': 'string',
            columnName: 'CODE'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        },
        status: {
            'type': 'string',
            columnName: 'STATUS'
        },
        scheduled_dt: {
            'type': 'string',
            columnName: 'SCHEDULED_DT'
        },
        scheduled_time: {
            'type': 'string',
            columnName: 'SCHEDULED_TIME'
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

