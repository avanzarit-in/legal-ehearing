(function () {
  'use strict';

  var serviceId = 'UserService';

  angular.module('inspinia').factory(serviceId, ['$http', '$q', '$window', 'HttpService', UserService]);

  function UserService($http, $q, $window, HttpService) {
    
    /**
     * POST /v1/Account/<authid>/User/login
     *
     * Login the user to eHearing.
     * Opens web sockets to the media server.
     * Returns agent details.
     *
     * @param {string} username     Username
     * @param {string} password     User Password
     * @param {string} place        Phone number to receive eHearing Call
     */

    var login = function (username, password, place) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      // POST http://<host>:< port>/v1/Account/<authid>/User/login
      //

      var url = baseUrl + '/v1/Account/' + authId + '/User/login';

      var data = {
        username: username,
        password: password,
        place: place
      }

      if (HttpService.testing()) {
        $window.localStorage.setItem('phone_number', place);

        var data = {
          "statusCode": 0,
          "statusMessage": "Login Succeeded",
          "userName": "7044565012"
        }

        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

      $http.post(url, data).then(
        function (success) {

          console.log(success);

          $window.localStorage.setItem('phone_number', place);
          $window.localStorage.setItem('username', username);
          $window.localStorage.setItem('agent_state', 'Ready');
          $window.localStorage.setItem('agent_role', success.data.role);
          $window.localStorage.setItem('agent_first_name', success.data.first_name);
          $window.localStorage.setItem('agent_last_name', success.data.last_name);
          $window.localStorage.setItem('agent_location', success.data.location);
          $window.localStorage.setItem('tenant_id', success.data.tenant_id);
          $window.localStorage.setItem('user_id', success.data.user_id);

          console.log(' Agent Role is ' + success.data.role);

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
     * POST /v1/Accounts/<authid>/Conference/logout
     *
     * Logout the user from eHearing.
     * Closes web sockets to the media server
     */

    var logout = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      // POST http://<host>:< port>/v1/Account/<authid>/User/logout
      //

      var url = baseUrl + '/v1/Account/' + authId + '/User/logout';

      var data = {
        username: $window.localStorage.getItem('username'),
        place: $window.localStorage.getItem('phone_number')
      }

      $http.post(url, data).then(
        function (success) {
          console.log(success);
          deferred.resolve(success.data);
          $window.localStorage.clear();
        },
        function (error) {
          console.log(error);
          deferred.reject(error);
        }
      )

      return deferred.promise;
    };

    /**
     * POST /v1/Account/<authid>/User/ready
     *
     * Change the state of the user to ready
     * Closes web sockets to the media server
     */

    var ready = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      // POST http://<host>:< port>/v1/Account/<authid>/User/ready
      //

      var url = baseUrl + '/v1/Account/' + authId + '/User/ready';

      var data = {}

      $http.post(url, data).then(
        function (success) {
          console.log(success);
          $window.localStorage.setItem('agent_state', 'Ready');
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
     * POST /v1/Accounts/<authid>/User/notready
     *
     * Change the state of the user to not ready
     * Closes web sockets to the media server
     */

    var notready = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      // POST http://<host>:< port>/v1/Account/<authid>/User/notready
      //

      var url = baseUrl + '/v1/Account/' + authId + '/User/notready';

      var data = {}

      $http.post(url, data).then(
        function (success) {
          console.log(success);
          $window.localStorage.setItem('agent_state', 'NotReady');
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
     * POST /v1/Accounts/<authid>/User/userState
     *
     * Get userState in real-time
     */

    var getUserState = function () {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';

      // POST http://<host>:< port>/v1/Accounts/<authid>/User/ready
      //

      var url = baseUrl + '/v1/Account/' + authId + '/User/userState';

      var data = {}

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

    var getLoginPhoneNumber = function () {
      
      var phone_number = $window.localStorage.getItem('phone_number');
      return phone_number;

    };

    var getUsername = function () {
      var username = $window.localStorage.getItem('username');

      return username;
    };

    var getAgentState = function () {

      var agentstate = $window.localStorage.getItem('agent_state');
      return agentstate;

    };

    var setAgentState = function (agent_state) {

      $window.localStorage.setItem('agent_state', agent_state);

    };

    var getAgentRole = function () {

      var agentrole = $window.localStorage.getItem('agent_role');
      return agentrole;

    };
    var getAgentFirstName = function () {

      var agentfirst = $window.localStorage.getItem('agent_first_name');
      return agentfirst;

    };
    var getAgentLastName = function () {

      var agentlast = $window.localStorage.getItem('agent_last_name');
      return agentlast;

    };
    var getAgentLocation = function () {

      var agentlocation = $window.localStorage.getItem('agent_location');
      return agentlocation;
      
    };

    var getTenantId = function () {

      var tenantId = $window.localStorage.getItem('tenant_id');
      return tenantId;
      
    };

    var getUserId = function () {

      var userid = $window.localStorage.getItem('user_id');
      return userid;
      
    };

    return {
      login: login,
      logout: logout,
      ready: ready,
      notready: notready,
      getLoginPhoneNumber: getLoginPhoneNumber,
      getUsername: getUsername,
      getAgentFirstName: getAgentFirstName,
      getAgentLastName: getAgentLastName,
      getAgentLocation: getAgentLocation,
      getAgentState: getAgentState,
      setAgentState: setAgentState,
      getAgentRole: getAgentRole,
      getUserState: getUserState,
      getTenantId: getTenantId,
      getUserId: getUserId
    };
  }
}());
