/**
 * TblSiteModel.js
 *
 * @description :: All Site goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_SITE',
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
        name: {
            'type': 'string',
            columnName: 'NAME'
        },
        is_enabled: {
            'type': 'integer',
            columnName: 'IS_ENABLED'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        }
    }
};

