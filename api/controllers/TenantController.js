/**
 * TenantController
 *
 * @description :: Server-side logic for managing Tenants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

const moment = require('moment');
const globly = require('globly');

module.exports = {

	/**
    * Get Master Account Details
	* TenantController.getAccount
	* This controller gets details about a tenant
	* GET https://api.ehearing.com/v1/Account/{auth_id}/
    */
	getAccount: function (req, res) {
		

    },

    /**
    * Modify Master Account Details
	* TenantController.modifyAccount
	* This controller  modifies a tenant name, address, city, state, zipcode, work phone, email and / or fax
    *  
    * POST https://api.ehearing.com/v1/Account/{auth_id}/
    */
	modifyAccount: function (req, res) {
		

    },

    /**
    * Create Sub Account / Tenant
	* TenantController.createTenant
	* This controller creates a sub tenant / account under parent tenant
    *  
    * POST https://api.ehearing.com/v1/Account/{auth_id}/Subaccount/
    */
	createTenant: function (req, res) {
		

    },

    /**
    * Modify Sub Account / Tenant Account Details
	* `TenantController.modifyTenant`
	* This controller modifies a sub tenant.
    *  
    * POST https://api.ehearing.com/v1/Account/{auth_id}/Subaccount/{subauth_id}/
    */
	modifyTenant: function (req, res) {
		

    },

    /**
    * Get Sub Account / Tenant Account Details
	* TenantController.getTenant
	* This controller gets details of a sub tenant / account under parent tenant
    *  
    * GET https://api.ehearing.com/v1/Account/{auth_id}/Subaccount/{subauth_id}/
    */
	getTenant: function (req, res) {
		

    },

    /**
    * Get All Sub Account / Tenant Account Details
	* TenantController.getAllTenant
	* This controller gets details of a sub tenant / account under parent tenant
    *  
    * GET https://api.ehearing.com/v1/Account/{auth_id}/Subaccount/
    */
	getAllTenant: function (req, res) {
		

    },

    /**
    * Delete a Sub Account / Tenant Account Details
	* TenantController.deleteTenant
	* This controller gets details of a sub tenant / account under parent tenant
    *  
    * DELETE https://api.ehearing.com/v1/Account/{auth_id}/Subaccount/{subauth_id}/
    */
	deleteTenant: function (req, res) {
		

    }
    
};

