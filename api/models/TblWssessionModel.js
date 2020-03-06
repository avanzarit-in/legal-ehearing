/**
 * TblWssessionModel.js
 *
 * @description :: All websocket session goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_WSSESSION',
    attributes: {
        id: {
            'type': 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            columnName: 'ID'
        },
        ipaddress: {
            'type': 'string',
            columnName: 'IPADDRESS'
        },
        status: {
            'type': 'string',
            columnName: 'STATUS'
        }
    }
};

