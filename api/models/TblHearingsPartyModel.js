/**
 * TblHearingsPartyModel.js
 *
 * @description :: All hearing party data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_HEARINGS_PARTY',
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
        docket_number: {
            'type': 'string',
            columnName: 'DOCKET_NUMBER'
        },
        party_code: {
            'type': 'string',
            columnName: 'PARTY_CODE'
        },
        party_desc: {
            'type': 'string',
            columnName: 'PARTY_DESC'
        },
        party_id: {
            'type': 'string',
            columnName: 'PARTY_ID'
        },
        first_name: {
            'type': 'string',
            columnName: 'FIRST_NAME'
        },
        middle_name: {
            'type': 'string',
            columnName: 'MIDDLE_NAME'
        },
        last_name: {
            'type': 'string',
            columnName: 'LAST_NAME'
        },
        business_name: {
            'type': 'string',
            columnName: 'BUSINESS_NAME'
        },
        home: {
            'type': 'string',
            columnName: 'HOME'
        },
        mobile: {
            'type': 'string',
            columnName: 'MOBILE'
        },
        work: {
            'type': 'string',
            columnName: 'WORK'
        },
        work_extension: {
            'type': 'string',
            columnName: 'WORK_EXTENSION'
        }
    }
};

