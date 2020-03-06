/**
 * TblEventsModel.js
 *
 * @description :: All events goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_EVENTS',
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
        type: {
            'type': 'string',
            columnName: 'TYPE'
        },
        body: {
            'type': 'string',
            columnName: 'BODY'
        }
    }
};

