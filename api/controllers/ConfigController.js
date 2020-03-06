/**
 * ConfigController
 *
 * @description :: Server-side logic for managing Global Configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

const moment = require('moment');
const globly = require('globly');

module.exports = {

	/**
    * Get Tenant Disposition Code
	* ConfigController.getDispCode
	* This controller gets details about tenant Disposition Code
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Disposition/dispCode
    */
    getDispCode: function (req, res) {
		
        params = {
            'tenant_id': req.param('tenant_id'),
            'is_enabled': req.param('is_enabled'),
        };

        ConfigService.getDispCode(params, function (error, response) {

            if (response!=undefined && response!=null) {

                if (response.length > 0) {

                    res.status(200).send(response);
                }
                else {

                    var res_params = {
                        'statusCode': '404',
                        'statusMsg': 'No data found for this tenant'
                    }

                    res.status(404).send(res_params);
                }

            }
            else {

                var res_params = {
                    'statusCode': '404',
                    'statusMsg': 'No data found for this tenant'
                }

                res.status(404).send(res_params);
            }

        });
    },

    /**
    * Create new Tenant Disposition Code
	* ConfigController.setDispCode
	* This controller  inserts new Disposition Code
    *  
    * POST https://api.ehearing.com/v1/Account/{auth_id}/Disposition/dispCode
    */
    setDispCode: function (req, res) {
		

    },

    /**
    * Delete an existing Disposition Code
	* ConfigController.delDispCode
	* This controller deletes a disposition code
    *  
    * DELETE https://api.ehearing.com/v1/Account/{auth_id}/Disposition/dispCode
    * 
    */
    delDispCode: function (req, res) {
		

    }
    
};

