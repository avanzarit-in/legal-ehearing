/**
 * HearingController
 *
 * @description :: Server-side logic for managing Hearing
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const globly = require('globly');
const moment = require('moment');

module.exports = {

	/**
    * Get All Hearings 
	* HearingController.list
	*
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Hearing
	*
	*/
	
	list: function (req, res) {


	},

	/**
    * Get Specific Hearing based on search parameters
	* HearingController.search
	*
	* GET https://api.ehearing.com/v1/Account/{auth_id}/Hearing/search
	*
	*/
	
	search: function (req, res) {

		var params = {};

		var search_field = req.param('search_field');
		var search_data = req.param(search_field);

	
		switch (search_field) {

			case 'scheduled_dt':

				params = {
					'tenant_id': req.session.tenant_id,
					'username': req.session.username,
					'user_id': req.session.user_id,
					'scheduled_dt': search_data
				};

				HearingService.list(params, function (error, response) {

					if (response != undefined && response != null) {

						if (response.length > 0) {

							res.status(200).send(response);
						}
						else {

							var res_params = {
								'statusCode': '404',
								'statusMsg': 'No data found'
							}
							res.status(404).send(res_params);
						}

					}
					else {

						var res_params = {
							'statusCode': '404',
							'statusMsg': 'No data found'
						}
						res.status(404).send(res_params);
					}


				});

				break;
			case 'all_user':

				params = {
					'scheduled_dt': search_data
				};

				console.log(params);

				HearingService.list(params, function (error, response) {

					if (response != undefined && response != null) {

						if (response.length > 0) {

							res.status(200).send(response);
						}
						else {

							var res_params = {
								'statusCode': '404',
								'statusMsg': 'No data found'
							}
							res.status(404).send(res_params);
						}

					}
					else {

						var res_params = {
							'statusCode': '404',
							'statusMsg': 'No data found'
						}
						res.status(404).send(res_params);
					}


				});
		
				break;
			case 'docket_number':

				
				break;

			default:

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'No Search Parameter Specified'
				}
				res.status(404).send(res_params);

				break;

		}

	},

	/**
    * Add a hearing
	* HearingController.add
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Hearing/add
	*
	*/

	add: function (req, res) {

		var scheduled_dt = req.param('scheduled_dt');
		var scheduled_time = req.param('scheduled_time');

		var appeal_date = scheduled_dt + ' ' + scheduled_time;

		appeal_date = moment(new Date(appeal_date)).format('YYYY-MM-DD HH:mm:ss');

		
		var params = {
			'tenant_id': req.session.tenant_id,
			'user_id': req.session.user_id,
			'site_id': req.session.site_id,
			'docket_number': req.param('docket_number'),
			'issue_id': req.param('issue_id'),
			'issue_seq_num': req.param('issue_seq_num'),
			'name': req.param('name'),
			'first_name': req.param('first_name'),
			'last_name': req.param('last_name'),
			'site_location': req.param('location'),
			'code': req.param('claim_type_cd'),
			'description': req.param('claim_type_desc'),
			'scheduled_dt': appeal_date
		};

		sails.log.info(params);

		HearingService.addDocket(params, function (result, response) {

			if (result == "Success") {

				res.status(200).send(response);
			}
			else {

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Docket cannot be added'
				}
				res.status(404).send(res_params);
			}

		});

	},

	/**
    * Add notes to a hearing
	* HearingController.addNotes
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Hearing/addNotes
	*
	*/

	addNotes: function (req, res) {

		var hearing_title = req.param('title');
		var hearing_notes = req.param('notes');
		
		var params = {
			'title': hearing_title,
			'notes': hearing_notes
		};

		sails.log.info(params);

	},

	/**
    * Add a party to existing hearing
	* HearingController.addParty
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Hearing/Party/add
	*
	*/

	addParty: function (req, res) {

		// Console Log
		//

		sails.log.info('Method: addParty'); 

		var params = {
			'tenant_id': req.session.tenant_id,
			'docket_number': req.param('docket_number'), 
			'party_code': req.param('party_code'), 
			'party_desc': req.param('party_desc'), 
			'party_id': req.param('party_id'), 
			'first_name': req.param('first_name'),
			'middle_name': req.param('middle_name'), 
			'last_name': req.param('last_name'), 
			'business_name': req.param('business_name'),
			'home': req.param('home'),
			'mobile': req.param('mobile'),
			'work': req.param('work'),
			'work_extension': req.param('work_extension')
		};

		HearingService.addParty(params, function (status, response) {

			if (status === 'success') {

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Party added to the docket',
					'id': response.id
				}

				// Console Log
				//

				sails.log.info(res_params);
				sails.log.info('Action: HearingService.addParty ' + ' Result: Added to Docket. ' + ' Docket Number: ' + req.param('docket_number') + ' User: ' + req.session.username);

				res.status(200).send(res_params);

			}
			else {

				var res_params = {
					'statusCode': '400',
					'statusMessage': 'Party was not added to the docket'
				}

				// Console Log
				//

				sails.log.info('Action: HearingService.addParty ' + ' Result: Not Added to Docket. ' + ' Docket Number: ' + req.param('docket_number') + ' User: ' + req.session.username);

				res.status(400).send(res_params);
			}
		});
	},

	/**
    * Remove a party from existing hearing
	* HearingController.removeParty
	*
	* POST https://api.ehearing.com/v1/Account/{auth_id}/Hearing/Party/remove
	*
	*/
	
	removeParty: function (req, res) {

		var params = {
			'id': req.param('id')
		};


		HearingService.removeParty(params, function (status, response) {

			if (status === 'success') {

				var res_params = {
					'statusCode': '200',
					'statusMessage': 'Party Removed',
					'id': req.param('id')
				}

				res.status('200').send(res_params);

			}
			else {

				var res_params = {
					'statusCode': '404',
					'statusMessage': 'Party Not Removed',
					'id': req.param('id')
				}

				res.status('404').send(res_params);
			}

		});
	}
};

