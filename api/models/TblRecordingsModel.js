/**
 * TblRecordingsModel.js
 *
 * @description :: All Recordings detail goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_RECORDINGS',
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
        mediasrvip: {
            'type': 'string',
            columnName: 'MEDIASRVIP'
        },
        record_name: {
            'type': 'string',
            columnName: 'RECORD_NAME'
        },
        record_dt: {
            'type': 'string',
            columnName: 'RECORD_DT'
        },
        record_time: {
            'type': 'string',
            columnName: 'RECORD_TIME'
        },
        recording_state: {
            'type': 'string',
            columnName: 'RECORDING_STATE'
        },
        status: {
            'type': 'string',
            columnName: 'STATUS'
        },
        filename: {
            'type': 'string',
            columnName: 'FILENAME'
        }
    }
};

