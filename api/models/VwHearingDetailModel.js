/**
 * VwHearingsModel.js
 *
 * @description :: All hearing data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'EHEARING_DB',
    tableName: 'VW_HEARING_DETAIL',
    attributes: {
        id: {
            'type': 'integer',
            columnName: 'ID'
        },
        user_id: {
            'type': 'integer',
            columnName: 'USER_ID'
        },
        username: {
            'type': 'string',
            columnName: 'USERNAME'
        },
        tenant_id: {
            'type': 'integer',
            columnName: 'TENANT_ID'
        },
        hearing_name: {
            'type': 'string',
            columnName: 'NAME'
        },
        filename: {
            'type': 'string',
            columnName: 'FILENAME'
        },
        first_name: {
            'type': 'string',
            columnName: 'FIRST_NAME'
        },
        last_name: {
            'type': 'string',
            columnName: 'LAST_NAME'
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
        scheduled_dt: {
            'type': 'string',
            columnName: 'SCHEDULED_DT'
        },
        scheduled_time: {
            'type': 'string',
            columnName: 'SCHEDULED_TIME'
        },
        start_dt: {
            'type': 'string',
            columnName: 'START_DT'
        },
        start_time: {
            'type': 'string',
            columnName: 'START_TIME'
        },
        duration: {
            'type': 'string',
            columnName: 'DURATION'
        },
        code: {
            'type': 'string',
            columnName: 'CODE'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        },
        hearing_status: {
            'type': 'string',
            columnName: 'HEARING_STATUS'
        },
        adherence_deviation: {
            'type': 'string',
            columnName: 'ADHERENCE_DEVIATION'
        },
        adherence_status: {
            'type': 'string',
            columnName: 'ADHERENCE_STATUS'
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

