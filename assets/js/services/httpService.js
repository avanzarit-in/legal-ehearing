(function () {
  'use strict';

  var serviceId = 'HttpService';

  angular.module('inspinia').factory(serviceId, [HttpService]);

  function HttpService() {
    
    var protocol = "http";
    var host = location.hostname;
    var port = location.port;
    var testingFlag = false;

    /**
    * Retrieve the base url for all of the necessary service calls
    */

    var getBaseUrl = function () {

      if (port === undefined || port === '') {

        return protocol + "://" + host;
      }
      else {

        return protocol + "://" + host + ':' + port;

      }

    };

    var testing = function () {
      return testingFlag;
    }

    return {
      getBaseUrl: getBaseUrl,
      testing: testing
    };
  }
}());
