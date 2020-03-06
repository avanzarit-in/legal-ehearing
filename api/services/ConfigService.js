// api/services/ConfigService.js

const moment = require('moment');
const globly = require('globly');

module.exports = {

	/**
	* `ConfigService.getDispCode()`
	*/
	getDispCode: function (params, callback) {

		console.log(params);

		TblDispositionCodeModel.find(params).exec(function(err,response) {

			if(!err){
			
				callback('200',response);
			
			}
			else{

				console.log(err);

				callback('404',null);
			}
		});

	}

};
