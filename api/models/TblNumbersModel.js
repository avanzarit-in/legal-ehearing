/**
 * TblNumbersModel.js
 *
 * @description :: All customer numbers goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_NUMBERS',
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
        number: {
            'type': 'string',
            columnName: 'NUMBER'
        },
        name: {
            'type': 'string',
            columnName: 'NAME'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        },
        tollfree: {
            'type': 'string',
            columnName: 'TOLLFREE'
        },
        local: {
            'type': 'string',
            columnName: 'local'
        },
        voice: {
            'type': 'string',
            columnName: 'VOICE'
        },
        sms: {
            'type': 'string',
            columnName: 'SMS'
        },
        fax: {
            'type': 'string',
            columnName: 'FAX'
        },
        is_enabled: {
            'type': 'integer',
            columnName: 'IS_ENABLED'
        }
    }
};

