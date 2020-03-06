/**
 * TblUserSessionModel.js
 *
 * @description :: All User Session goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_USERSESSION',
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
        phone: {
            'type': 'string',
            columnName: 'PHONE'
        },
        action: {
            'type': 'string',
            columnName: 'ACTION'
        },
        browser: {
            'type': 'string',
            columnName: 'BROWSER'
        },
        host: {
            'type': 'string',
            columnName: 'HOST'
        },
        sessionid: {
            'type': 'string',
            columnName: 'SESSIONID'
        }
    }
};

