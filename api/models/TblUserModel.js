/**
 * TblUserModel.js
 *
 * @description :: All User goes in here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'EHEARING_DB',
    tableName: 'TBL_USER',
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
        role_id: {
            'type': 'integer',
            columnName: 'ROLE_ID'
        },
        first_name: {
            'type': 'string',
            columnName: 'FIRST_NAME'
        },
        last_name: {
            'type': 'string',
            columnName: 'LAST_NAME'
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
        site_id: {
            'type': 'integer',
            columnName: 'SITE_ID'
        },
        employee_id: {
            'type': 'string',
            columnName: 'EMPLOYEE_ID'
        },
        user_name: {
            'type': 'string',
            columnName: 'USER_NAME'
        },
        password: {
            'type': 'string',
            columnName: 'PASSWORD'
        },
        is_enabled: {
            'type': 'integer',
            columnName: 'IS_ENABLED'
        },
        office: {
            'type': 'string',
            columnName: 'OFFICE'
        },
        mobile: {
            'type': 'string',
            columnName: 'MOBILE'
        },
        home: {
            'type': 'string',
            columnName: 'HOME'
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

