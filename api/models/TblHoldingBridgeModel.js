/**
 * TblHoldingBridgeModel.js
 *
 * @description :: All hearing data goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_HOLDINGBRIDGE',
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
        h_bridgeid: {
            'type': 'string',
            columnName: 'H_BRIDGEID'
        },
        c_bridgeid: {
            'type': 'string',
            columnName: 'C_BRIDGEID'
        }
    }
};

