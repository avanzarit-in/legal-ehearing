/**
 * TblUserTeamModel.js
 *
 * @description :: All User Team goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_USER_TEAM',
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
        team_id: {
            'type': 'integer',
            columnName: 'TEAM_ID'
        },
        name: {
            'type': 'string',
            columnName: 'NAME'
        },
        is_enabled: {
            'type': 'integer',
            columnName: 'INTEGER'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        }
    }
};

