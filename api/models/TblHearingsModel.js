/**
 * TblHearingsModel.js
 *
 * @description :: All hearing data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'EHEARING_DB',
    tableName: 'TBL_HEARINGS',
    attributes: {
        id: {
            'type': 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true,
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
        site_id: {
            'type': 'integer',
            columnName: 'SITE_ID'
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
        }
    }
};

