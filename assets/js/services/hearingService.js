(function () {
  'use strict';

  var serviceId = 'HearingService';

  angular.module('inspinia').factory(serviceId, ['$http', '$q', '$window', 'HttpService', HearingService]);

  function HearingService($http, $q, $window, HttpService) {

    /**
    * GET /v1/Account/<authid>/Hearing
    *
    * Retrieves the list of hearings available to the user
    */

    var getHearings = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';
      var url = baseUrl + '/v1/Account/' + authId + '/Hearing';

      var data = {};

      console.log(data);

      $http.get(url).then(
        function (success) {

          console.log(success);
          $window.localStorage.setItem('appealsList', JSON.stringify(success.data));
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    /**
    * GET /v1/Accounts/<authid>/Hearing/<hearing date>
    *
    * Retrieves the list of hearing by date available to the user
    */

    var getHearingByDate = function (hearing_date) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';
      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Search';

      console.log(url);

      var data = {
        'search_field': 'scheduled_dt',
        'scheduled_dt': hearing_date
      }

      $http.post(url, data).then(
        function (success) {

          console.log(success);
          $window.localStorage.setItem('appealsList', JSON.stringify(success.data));
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    /**
     * GET /v1/Accounts/<authid>/Hearing/search
     *
     * Retrieves the list of appeals by date available to the user
     */

    var getHearingsAllUser = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';
      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Search';

      console.log(url);

      var currentDate = new Date();
      var appeal_date = moment(currentDate).format('MM/DD/YYYY');

      var data = {
        'search_field': 'all_user',
        'all_user': appeal_date
      }

      console.log(data);

      $http.post(url, data).then(
        function (success) {

          console.log(success);
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    var getHearingByDocketId = function (docket_id) {

      var appealsList = JSON.parse($window.localStorage.getItem('appealsList'));

      for (var i = 0; i < appealsList.length; ++i) {
        var appeal = appealsList[i];

        if (appeal.docket_number.toString() === docket_id.toString()) {
          return appeal;
        }

      }
    }

    /**
    * POST /v1/Account/<authid>/Hearing/add
    * Adds new Hearing.
    */

    var addNewDocket = function (docketModel) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/add';

      $http.post(url, docketModel).then(
        function (success) {

          console.log(success);
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    function encodeQueryData(data) {
      let queryData = [];
      for (let d in data)
        queryData.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      return queryData.join('&');
    }

    /**
    * POST /v1/Account/<authid>/Hearing/Search
    * Adds new Hearing.
    */

    var searchDockets = function (docket_number) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Search';

      console.log(url);

      var data = {
        'search_field': 'docket_number',
        'docket_number': docket_number
      }

      $http.post(url, data).then(
        function (success) {

          console.log(success);
          $window.localStorage.setItem('appealsList', JSON.stringify(success.data));
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    /**
    * POST /v1/Account/<authid>/Hearing/Search
    * Refresh Hearing.
    */

    var refreshDocket = function (docket_number) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Search';

      console.log(url);

      var data = {
        'search_field': 'docket_number',
        'docket_number': docket_number
      }

      $http.post(url, data).then(
        function (success) {

          console.log(success);
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    /**
    * POST /v1/Account/<authid>/Hearing/reload
    * Reload Hearing.
    */

    var loadDockets = function (user_name) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/reload';

      url += '?username=' + user_name;

      console.log(url);

      $http.get(url).then(
        function (success) {

          console.log(success);
          deferred.resolve(success.data);

        },
        function (error) {

          console.log(error);
          deferred.reject(error);

        }
      )

      return deferred.promise;
    };

    /**
    * POST /v1/Accounts/<authid>/Hearing/Party/addNew
    * Adds or Updates the Hearing Party Info.
    * @param {Object} participantModel   An object model containing all of the parameters needed for a participant
    */

    var addNewParty = function (participantModel) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Party/add';

      $http.post(url, participantModel).then(
        function (success) {
          console.log(success);
          deferred.resolve(success.data);
        },
        function (error) {
          console.log(error);
          deferred.reject(error);
        }
      )

      return deferred.promise;
    };

   /**
    * POST /v1/Accounts/<authid>/Hearing/Party/remove
    * Adds or Updates the Hearing Party Info.
    * @param {Object} participantModel   An object model containing all of the parameters needed for a participant
    */

    var removeParty = function(memberId){

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';
      var url = baseUrl + '/v1/Account/' + authId + '/Hearing/Party/remove';

      var data = {
        id: memberId
      }

      $http.post(url, data).then(
        function(success){

          console.log(success);
          deferred.resolve(success.data);
        },
        function(error){

          console.log(error);
          deferred.reject(error);
        }
      )

      return deferred.promise;
    };

    /**
    * GET /v1/Account/<authid>/Disposition/dispCode
    * Get Disposition Code.
    */

   var getDispCode = function (tenantId) {

    var deferred = $q.defer();
    var baseUrl = HttpService.getBaseUrl();
    var authId = 'dars';

    var url = baseUrl + '/v1/Account/' + authId + '/Disposition/dispCode';

    url += '?tenant_id=' + tenantId + '&is_enabled=1';

    console.log(url);

    $http.get(url).then(
      function (success) {

        console.log(success);

        $window.localStorage.setItem('disp_code', JSON.stringify(success.data));

        deferred.resolve(success.data);

      },
      function (error) {

        console.log(error);
        deferred.reject(error);

      }
    )

    return deferred.promise;
  };

  var listDispCode = function () {

    var dispCode = $window.localStorage.getItem('disp_code');
    return dispCode;
    
  };


    return {
      getHearings: getHearings,
      getHearingByDocketId: getHearingByDocketId,
      getHearingByDate: getHearingByDate,
      searchDockets: searchDockets,
      loadDockets: loadDockets,
      refreshDocket: refreshDocket,
      addNewDocket: addNewDocket,
      getHearingsAllUser: getHearingsAllUser,
      addNewParty: addNewParty,
      removeParty: removeParty,
      getDispCode: getDispCode,
      listDispCode: listDispCode
    };
  }
}());
