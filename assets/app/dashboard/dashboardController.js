(function () {
  'use strict';

  var controllerId = "dashboardController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$scope', '$location', '$window','SweetAlert','UserService',  'HearingService', 'AnalyticService', 'ConferenceService', '$stateParams', '$uibModal', dashboardController]);

  function dashboardController($rootScope, $scope, $location, $window, SweetAlert,UserService, HearingService, AnalyticService, ConferenceService, $stateParams, $uibModal) {
    var vm = this;
    var dashSocket;

    vm.briefs = [];
    vm.brief = [];
    vm.avgstat = [];
    vm.login_phone_number = "";
    vm.username = "";
    vm.labelClass = "";
    vm.labelText = "";
    vm.agentstate = "";

    vm.newDocket = {
      docket_number: '',
      name: '',
      claim_type_cd: '',
      claim_type_desc: '',
      scheduled_dt: '',
      scheduled_hour: '',
      scheduled_min: ''
    };

    function activate(){
      console.log("Activate Dashboard Controller");

      vm.login_phone_number = UserService.getLoginPhoneNumber();
      vm.user_name = UserService.getUsername();
      vm.agent_state = UserService.getAgentState();
      vm.agent_first_name = UserService.getAgentFirstName();
      vm.agent_last_name = UserService.getAgentLastName();
      vm.agent_location = UserService.getAgentLocation();
      vm.tenant_id = UserService.getTenantId();
      

      switch (vm.agent_state) {

        case 'Ready':
          vm.labelClass = 'label-primary';
          vm.labelText = 'READY';

        break;

        case 'NotReady':

          vm.labelClass = 'label-warning';
          vm.labelText = 'NOT READY';

        break;
      }

      HearingService.getDispCode(vm.tenant_id).then(

        function(data){

          console.log(data);
          
        },
        function(error){

          console.log(error);

      });

      var currentDate = new Date();
      var appeal_date = moment(currentDate).format('MM/DD/YYYY');
      vm.newDocket.scheduled_dt = moment(currentDate).format('MM/DD/YYYY');

      HearingService.getHearingByDate(appeal_date).then(

        function(data){

          console.log(data);
          vm.briefs = data;

        },
        function(error){

          console.log(error);
          vm.briefs = [];

        });

        AnalyticService.getAvgStatData().then(
          function(data){
            console.log(data);
            vm.avgstat = data;
          },
          function(error){
            console.log(error);
            vm.avgstat = [];
          });

      vm.statData = {
        annualHearings: 145,
        avgMonthlyHearings: 18,
        avgWeeklyHearings: 9,
        avgDailyHearings: 2
      };

      vm.setupSockets();
    }

    function isString(value) {
      return typeof value === 'string' || value instanceof String;
    };

    /**
     * Expected Properties
     *
     * {"event":"Device","deviceId":"b9d954c8-3052-446d-9a60-eeacc685a5bd","deviceStatus":"Active","userStateId":"900D55CC-2BB0-431F-8BF9-D3525B383BE6","userStatus":"NotReady","phone":"7044565012","user_id":"7044565012"}
     * {"event":"Device","deviceId":"b9d954c8-3052-446d-9a60-eeacc685a5bd","deviceStatus":"Active","userStateId":"0F7F5003-EF26-4D13-A6Ef-D0C7EC819BEB","userStatus":"LoggedOut","phone":"7044565012","user_id":"7044565012"}
     * {"event":"Device","deviceId":"b9d954c8-3052-446d-9a60-eeacc685a5bd","deviceStatus":"Active","userStatus":"LoggedIn","phone":"7044565012","user_id":"7044565012"}
     * {"event":"Device","deviceId":"b9d954c8-3052-446d-9a60-eeacc685a5bd","deviceStatus":"Active","userStateId":"9430250E-0A1B-421F-B372-F29E69366DED","userStatus":"Ready","phone":"7044565012","user_id":"7044565012"}
     *
     * @param {*} eventObj
     */

    function processDeviceEvent(eventObj) {

      UserService.setAgentState(eventObj['userStatus']);

      switch (eventObj['userStatus']) {

        case 'Ready':

          $scope.$apply(function () {

            vm.labelClass = 'label-primary';
            vm.labelText = 'READY';
          });

        break;

        case 'NotReady':

          $scope.$apply(function () {

            vm.labelClass = 'label-warning';
            vm.labelText = 'NOT READY';
          });

        break;

        case 'LoggedOut':

          UserService.logout().then(
            function (success) {
              console.log(success);
              $window.location.href="/";
            },
            function (error) {
    
            }
          )

        break;

        case 'LoggedIn':

          $scope.$apply(function () {

            vm.labelClass = 'label-info';
            vm.labelText = 'LOGGED IN';
          });

        break;

      }

    }

    vm.processEvent = function(eventMsg) {

      var eventObj = eventMsg;
      console.log(eventMsg);

      if (isString(eventMsg)) {
        eventObj = JSON.parse(eventMsg);
      }

      switch (eventObj['event']) {
        case "Device":

          processDeviceEvent(eventObj);

        break;

        case "Call":

          break;
      }

    };

    /*vm.disconnectSockets = function(){
      console.log("vm.disconnectSockets - dashboardController");
      dashSocket.off('devices');
      dashSocket.off('calls');
    };

    $rootScope.$on('$locationChangeStart', function(event) {
      console.log('Dashboard - Location Change');
      vm.disconnectSockets();
    });*/

    vm.addDocket = function () {

      var addNewDocket=[];

      var docketNumber = vm.newDocket.docket_number.split("-");
      var issueNum = docketNumber[0];
      var issueSeqNum = docketNumber[1];

      var strDocketNumber = parseInt(issueNum,10) + '-'+ parseInt(issueSeqNum,10);

      addNewDocket = {
        docket_number: strDocketNumber,
        issue_id: parseInt(issueNum,10),
        issue_seq_num: parseInt(issueSeqNum,10),
        user_id: vm.user_name,
        name: vm.newDocket.name,
        first_name: vm.agent_first_name,
        last_name: vm.agent_last_name,
        location: vm.agent_location,
        claim_type_cd: vm.newDocket.claim_type_cd,
        claim_type_desc: vm.newDocket.claim_type_desc,
        scheduled_dt: vm.newDocket.scheduled_dt,
        scheduled_time: vm.newDocket.scheduled_time
      }

      HearingService.addNewDocket(addNewDocket).then(

        function(success){
          if(success){
            console.log(success[0]);
            $window.location.reload();
          }
          else{
            console.log(success[0]);
          }

        },
        function (error) {
          console.log(error);
        }
      );

      vm.newDocket = {
        docket_number: '',
        name: '',
        claim_type_cd: '',
        claim_type_desc: '',
        scheduled_dt: moment(new Date()).format('MM/DD/YYYY'),
        scheduled_time: ''
      };
    };

    vm.setupSockets = function(){

      var reConnect = false;

      dashSocket = io.sails.connect();

      dashSocket.on('connect', function (reason) {

        console.log('Dashboard Controller - The Server has connected');

        dashSocket.get('/v1/Account/dars/Socket/getId', function (msg) {
          console.log(' Dashboard Controller - My Socket ID is: ' + msg);
        });

        var roomName = UserService.getUsername();

        dashSocket.post('/v1/Account/dars/Socket/join', { roomName: roomName }, function (msg) {
          console.log(' Dashboard Controller - My Room is: ' + roomName);
          console.log(msg);
        });

        if(!reConnect) {

          console.log('This is normal connect');

        }
        else {

          console.log('This is re connect');

          vm.socket.post('/v1/Account/dars/Socket/refresh',{}, function (msg) {

            console.log(msg);
          
          });
        }

        dashSocket.on('devices', function (msg) {
          console.log(' Dashboard Controller - Added Listener: devices ');
          console.log(msg);
          vm.processEvent(msg);
        });
  
        dashSocket.on('calls', function (msg) {
          console.log(' Dashboard Controller - Added Listener: calls ');
          // processEvent(msg);
  
        });

      });

      dashSocket.on('disconnect', function (reason) {

        console.log(' Dashboard Controller - The Server has disconnected ' + reason);

      });
    };

    vm.logout = function(){
      UserService.logout().then(
        function(success) {
          console.log(success);
          $window.location.href="/";
        },
        function (error){

        }
      )
    };

    vm.ready = function(){
      UserService.ready().then(
        function(success) {
          console.log(success);
        },
        function (error){
 
        }
      )
    }
 
    vm.notready = function(){
      UserService.notready().then(
        function(success) {
          console.log(success);
        },
        function (error){
 
        }
      )
    }

    vm.displayDocketSearchModal = function(){
      var options = {
        templateUrl: '/app/dashboard/docketSearchModal.html',
        controller: 'docketSearchModalController',
        controllerAs: 'vm'
      }

      var modalInstance = $uibModal.open(options);

      modalInstance.result.then(function(data){
        
        console.log(data);

        vm.briefs.push(data);
        
      }, function() {
        console.log("Modal Dismissed.");
      })

      modalInstance.close(function(data){
        vm.briefs.push(data);
      });

      modalInstance.dismiss(function(data){
        vm.briefs.push(data);
      });
    }

    activate();


    $scope.$on('displayBriefMainDetail', function(event, data){
      console.log(data);
      //$scope.$broadcast('updateMainDetail', data);

      var options = {
        templateUrl: '/app/dashboard/docketBriefModal.html',
        controller: 'docketBriefModalController',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          briefData: function () {
            return data;
          }
        } 
      }

      var modalInstance = $uibModal.open(options);

      modalInstance.close(function(data){
        
      });

      modalInstance.dismiss(function(data){
        
      });

    });

    $scope.$on('refreshDocket', function(event, data){

      console.log('Perform Refresh.');
      console.log(data);

      var strDocketNumber = data.docket_number;

      console.log(' Docket Number - Refresh : ' + strDocketNumber);
      
      HearingService.refreshDocket(strDocketNumber).then(
        function(success){
          if(success){
            console.log(success[0]);
            $window.location.reload();
          }
          else{
            console.log(success);
          }

        },
        function(error){
          console.log(error);
        }
      )

    });

    vm.reloadDockets = function(){

      console.log('Perform Refresh.');

      HearingService.loadDockets(vm.user_name).then(

        function(success){
          if(success){
            console.log(success);
            $window.location.reload();
          }
          else{
            console.log(success);
          }

        },
        function(error){
         
          console.log(error);
        }
      )
    }

    vm.logOutAlert = function () {
      SweetAlert.swal({
        title: "Are you sure?",
        text: "You are about to Log out!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Log out!",
        cancelButtonText: "No, cancel the request!",
        closeOnConfirm: false,
        closeOnCancel: false },
        function (isConfirm) {
            if (isConfirm) {
                vm.logout();
                SweetAlert.swal("Done!", "You have successfully logged out", "success");
            } else {
                SweetAlert.swal("Cancelled", "You are safe :)", "error");
            }
        });
    };

    vm.processDate = function(date_string){
      var momentObj = moment(date_string);
  
      //console.log(momentObj);
  
      var monthDayWhen = momentObj.format('MM.DD');
      var monthDayToday = moment().format('MM.DD');
      
      return date_string;
    }
  
    vm.processTime = function(date_string,time_string){
      var momentObj = moment(date_string + ' ' + time_string);
  
      //console.log(momentObj);
  
      var newTimeFormat = momentObj.format('hh:mm:ss A'); 
      
      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
    }
  }

  

}());
