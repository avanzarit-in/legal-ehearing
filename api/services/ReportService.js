// api/services/ReportService.js

const globly = require('globly');

module.exports = {

	/**
   * `ReportService.adherence()`
   */
  	adherence: function (params, callback) {

		VwHearingDetailModel.find(params).exec(function(err,hearingview) {

			console.log(err);
			console.log(hearingview);
			
			if(err){
				callback(err,hearingview);
			}
			else {
				callback(err,hearingview);
			};
		});
	},
	/**
   * `ReportService.statAvg()`
   */
	statAvg: function (params, callback) {

		VwHearingStatAvgModel.find(params).exec(function(err,response) {

			if(err){
				callback("Failed",response);
			}
			else {
				callback("Success",response);
			};
		});
	},

	recExport: function (params, callback) {

		RecConv_View.find(params).exec(function(err,response) {

			if(err){
				callback("Error",response);
			}
			else {
				callback("Success",response);
			};
		});
	}
};
