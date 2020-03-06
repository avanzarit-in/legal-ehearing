/**
 * TblRecordingsTagModel.js
 *
 * @description :: All Recordings Tag detail goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_RECORDINGS_TAG',
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
        conference_sid: {
            'type': 'string',
            columnName: 'CONFERENCE_SID'
        },
        label: {
            'type': 'string',
            columnName: 'LABEL'
        },
        description: {
            'type': 'string',
            columnName: 'DESCRIPTION'
        },
        taggedat: {
            'type': 'string',
            columnName: 'TAGGEDAT'
        }
    }
};

