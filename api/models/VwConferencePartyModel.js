/**
 * TblConferencePartyModel.js
 *
 * @description :: All conference oarties goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'VW_CONFERENCE_PARTY',
    attributes: {
        id: {
            'type': 'integer',
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
        user_name: {
            'type': 'string',
            columnName: 'USER_NAME'
        },
        conference_sid: {
            'type': 'string',
            columnName: 'CONFERENCE_SID'
        },
        participant_sid: {
            'type': 'string',
            columnName: 'PARTICIPANT_SID'
        },
        announcer_sid: {
            'type': 'string',
            columnName: 'ANNOUNCER_SID'
        },
        call_to: {
            'type': 'string',
            columnName: 'CALL_TO'
        },
        role: {
            'type': 'string',
            columnName: 'ROLE'
        },
        state: {
            'type': 'string',
            columnName: 'STATE'
        },
        dialstatus: {
            'type': 'string',
            columnName: 'DIALSTATUS'
        },
        cause: {
            'type': 'string',
            columnName: 'CAUSE'
        },
        cause_txt: {
            'type': 'string',
            columnName: 'CAUSE_TXT'
        },
        createdAt:{
			'type':'datetime',
			columnName: 'CREATEDAT'
		},
		updatedAt:{
			'type':'datetime',
			columnName: 'UPDATEDAT'
		}
    }
};

