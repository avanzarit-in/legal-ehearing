/**
 * TblTenantModel.js
 *
 * @description :: All Tenant goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_TENANT',
    attributes: {
        id: {
            'type': 'integer',
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            columnName: 'ID'
        },
        account_num: {
            'type': 'string',
            columnName: 'ACCOUNT_NUM'
        },
        auth_sid: {
            'type': 'string',
            columnName: 'AUTH_SID'
        },
        auth_token: {
            'type': 'string',
            columnName: 'AUTH_TOKEN'
        },
        name: {
            'type': 'string',
            columnName: 'NAME'
        },
        address_line1: {
            'type': 'string',
            columnName: 'ADDRESS_LINE1'
        },
        address_line2: {
            'type': 'string',
            columnName: 'ADDRESS_LINE2'
        },
        address_line3: {
            'type': 'string',
            columnName: 'ADDRESS_LINE3'
        },
        city: {
            'type': 'string',
            columnName: 'CITY'
        },
        state: {
            'type': 'string',
            columnName: 'STATE'
        },
        zipcode: {
            'type': 'string',
            columnName: 'ZIPCODE'
        },
        country: {
            'type': 'string',
            columnName: 'COUNTRY'
        },
        parent_tenant_id: {
            'type': 'integer',
            columnName: 'PARENT_TENANT_ID'
        },
        is_super_tenant: {
            'type': 'integer',
            columnName: 'IS_SUPER_TENANT'
        },
        is_enabled: {
            'type': 'integer',
            columnName: 'IS_ENABLED'
        },
        work: {
            'type': 'string',
            columnName: 'WORK'
        },
        email: {
            'type': 'string',
            columnName: 'EMAIL'
        },
        fax: {
            'type': 'string',
            columnName: 'FAX'
        }
    }
};

