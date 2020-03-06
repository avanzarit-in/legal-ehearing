/**
 * HearingService
 *
 * @description :: Hearing Service
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

const globly = require('globly');
const moment = require('moment');

module.exports = {


	/**
    * List all hearings
	* HearingService.list
	*
	*/

	list: function (params, callback) {

		VwHearingsModel.find(params).exec(function (err, hearings) {

			if (err) {
				callback(null, hearings);
			}
			else {

				var itemProcessed = 0;
				var hearings_array = [];

				hearings.forEach(function (hearing) {

					TblHearingsPartyModel.find({ docket_number: hearing.docket_number }).exec(function (err, hearingParties) {

						hearing.participants = hearingParties;
						hearings_array[itemProcessed] = hearing;

						itemProcessed++;

						if (itemProcessed === hearings.length) {

							callback(null, hearings_array);
						}

					});


				});

			}
		});
	},

	/**
	* `HearingService.hearingByuser()`
	*/
	hearingByuser: function (client,params, callback) {

		client.get_hearingByuser(params, function (status, response) {

			callback(status,response);

		});

	},

	/**
	* `HearingService.hearingBydocket()`
	*/
	hearingBydocket: function (client,params, callback) {

		
	},

	/**
	* `HearingService.hearingBydate()`
	*/
	hearingBydate: function (client,params, callback) {

		
	},

	findHearing: function (hearing, callback) {

		

	},

	addUpdateHearings: function (response, callback) {

		

	},

	updateHearing: function (hearing,userDetails, callback) {

		


	},
	createHearing: function (hearing,userDetails, callback) {

		


	},

	addDocket: function (docket_params, callback) {

		TblHearingsModel.create(docket_params).exec(function (err, appeal) {

			if(!err) {

				callback("Success",appeal);
			}
			else {

				callback("Failure",null);
			}

		});

	},

	addUpdateParticipants: function (docket_number,participantsInfo, callback) {

		
	},

	/**
	* `HearingService.addParty`
	*/
	addParty: function (party_params, callback) {

		console.log(party_params);

		TblHearingsPartyModel.create(party_params).exec(function(err,hearingParty) {

			if(err) {

				callback('failure',null);
			}
			else {

				setTimeout(() => {

					var find_params = {
						'tenant_id': party_params['tenant_id'],
						'docket_number': party_params['docket_number'],
						'first_name': party_params['first_name'],
						'last_name': party_params['last_name'],
						'home': party_params['home'],
						'mobile': party_params['mobile'],
						'work': party_params['work']
					};

					TblHearingsPartyModel.find(find_params).exec(function(err,findMember) {

						sails.log.info(findMember[0]);
						callback('success',findMember[0]);

					});
				}, 1000);
			}

			sails.log.info('Member created');

		});
	},

	/**
	* `HearingService.removeParty`
	*/

	removeParty: function (params, callback) {


		TblHearingsPartyModel.destroy(params).exec(function(err,hearingParty) {

			if(err) {

				callback('Failure',null);
			}
			else {

				callback('success',null);
			}

		});
	}

};
