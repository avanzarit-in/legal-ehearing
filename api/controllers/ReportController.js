/**
 * ReportController
 *
 * @description :: Server-side logic for managing Conferences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const globly = require('globly');
const moment = require('moment');

module.exports = {

	/**
	* `ReportController.adherence`
	* This controller gets the adherence 
	* GET http://api.globly.co/v1/Account/{auth_id}/Analytic/adherence
	*
   */
  	adherence: function (req, res) {

		var params = {};

		var report_start_dt =  req.param('report_start_dt');
		var report_end_dt =  req.param('report_end_dt');
		var report_status = req.param('status')!==undefined?req.param('status'):'';

		if(req.param('role') == 'user'){
			params = {
				'username': req.session.username,
				'scheduled_dt': { '>=': report_start_dt,'<=': report_end_dt }
			};
		}
		else {

			params = {
				'scheduled_dt': { '>=': report_start_dt,'<=': report_end_dt }
			};
		}

		if (report_status.length > 0 ){
			params.hearing_status=report_status;
		}

		console.log(params);
		
		ReportService.adherence(params,function(error,response){
			
			res.json(response);

		});

	},
	/**
	* `ReportController.statAvg`
	* This controller gets the appeals completed
	* GET http://api.globly.co/v1/Accounts/{auth_id}/Report/hearing/statAvg
	*
   */
	statAvg: function (req, res) {

		var params = {};

		params = {
			'user_name': req.session.username
		};

		ReportService.statAvg(params,function(status,response){
			
			if(status == 'Success') {

				var res_params = {
					'Description': 'Hearing statistics for user', 
					'StatCategory': 'Averages',
					'week': response[0].week,
					'month': response[0].month,
					'quarter': response[0].quarter,
					'year': response[0].year,
				};

				res.status(200).send(res_params);
				
			}
			else {

				var res_params = {
					'Description': 'Hearing statistics for user', 
					'StatCategory': 'Averages',
					'week': 'NaN',
					'month': 'NaN',
					'quarter': 'NaN',
					'year': 'NaN',
				};

				res.status(200).send(res_params);
			};

		});

	}

};

