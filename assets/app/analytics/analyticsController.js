(function(){
  'use strict';

  var controllerId = "analyticsController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$scope',  '$location',  '$window', 'DTOptionsBuilder','SweetAlert', 'UserService', 'AnalyticService', 'ConferenceService', '$stateParams',analyticsController]);

  function analyticsController($rootScope, $scope, $location, $window, DTOptionsBuilder,  SweetAlert, UserService, AnalyticService, ConferenceService, $stateParams){

    var vm = this;
    var reportSocket;

    vm.briefs=JSON.parse($window.localStorage.getItem('appealsList'));
    
    vm.login_phone_number = "";
    vm.username = "";
    vm.labelClass = "";
    vm.labelText = "";
    vm.agentstate = "";

    vm.hearing = [];

    vm.updatingHearings = false;

    vm.report_start_dt;
    vm.report_end_dt;
    vm.report_role;


    vm.filter = {
      report_start_dt: '',
      report_end_dt: '',
      role: 'user'
    };


    vm.currentDate = new Date();

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'MM/dd/yyyy', 'shortDate'];
    vm.format = vm.formats[2];

    function activate(){
      console.log("Activate Analytics Controller");

      vm.login_phone_number = UserService.getLoginPhoneNumber();
      vm.user_name = UserService.getUsername();
      vm.agent_state = UserService.getAgentState();
      vm.agent_role = UserService.getAgentRole();

      vm.agent_first_name = UserService.getAgentFirstName();
      vm.agent_last_name = UserService.getAgentLastName();
      vm.agent_location = UserService.getAgentLocation();
      
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

      

      vm.report_start_dt = moment(vm.currentDate).format('MM/DD/YYYY');
      vm.report_end_dt = moment(vm.currentDate).format('MM/DD/YYYY');
      vm.report_role = 'user';

      getReportData();

      vm.setupSockets();

    };

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
            function(success) {
              console.log(success);
              $window.location.href=("/");
            },
            function (error){
    
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

   /* vm.disconnectSockets = function(){
      console.log("vm.disconnectSockets - analyticsController");
      reportSocket.off('devices');
      reportSocket.off('calls');
    };

    $rootScope.$on('$locationChangeStart', function(event) {
      console.log('Analytics - Location Change');
      vm.disconnectSockets();
    });*/

    vm.setupSockets = function(){

      var reConnect = false;

      reportSocket = io.sails.connect();

      reportSocket.on('connect', function (reason) {

        console.log('Dashboard Controller - The Server has connected');

        reportSocket.get('/v1/Accounts/dars/Conference/Socket/getId', function (msg) {
          console.log(' Analytics Controller - My Socket ID is: ' + msg);
        });

        var roomName = UserService.getUsername();

        reportSocket.post('/v1/Accounts/dars/Conference/Socket/join', { roomName: roomName }, function (msg) {
          console.log(' Analytics Controller - My Room is: ' + roomName);
          console.log(msg);
        });

        if(!reConnect) {

          console.log('This is normal connect');

        }
        else {

          console.log('This is re connect');

          vm.socket.post('/v1/Accounts/dars/Conference/Socket/refresh',{}, function (msg) {

            console.log(msg);
          
          });
        }

        reportSocket.on('devices', function (msg) {
          console.log(' Analytics Controller - Added Listener: devices ');
          console.log(msg);
          vm.processEvent(msg);
        });
  
        reportSocket.on('calls', function (msg) {
          console.log(' Analytics Controller - Added Listener: calls ');
          // processEvent(msg);
  
        });

      });

      reportSocket.on('disconnect', function (reason) {

        console.log(' Analytics Controller - The Server has disconnected ' + reason);

      });
    };

    vm.logout = function(){
      UserService.logout().then(
        function(success) {
          console.log(success);
          $window.location.href=("/");
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

    var getReportData = function(){
      vm.updatingHearings = true;

      if(vm.report_start_dt){
        vm.filter.report_start_dt = moment(vm.report_start_dt).format('MM/DD/YYYY');
      }

      if(vm.report_end_dt){
        vm.filter.report_end_dt = moment(vm.report_end_dt).format('MM/DD/YYYY');
      }
    
      vm.filter.role = vm.report_role;

      AnalyticService.getReportData(vm.filter).then(
        function(data){
          console.log(data);
          var processedData = [];
          
          for(var i = 0; i < data.length; ++i){
            var hearingItem = data[i];

            hearingItem.scheduled_dt = moment(hearingItem.scheduled_dt).format('MM/DD/YYYY');

            processedData.push(hearingItem);
          }

          vm.hearing = processedData;
          vm.updatingHearings = false;
        },
        function(error){
          console.log(error);
        }
      );
    }

    vm.filterHearings = function(){
      getReportData();
    }

    

    vm.dtOptions = DTOptionsBuilder.newOptions().withDOM('<"html5buttons"B>lTfgitp').withButtons([
        {extend: 'copy'},
        {extend: 'csv'},
        {extend: 'excel'},
        {extend: 'pdf',
        title: ' DARS Adherence Report',
        filename: 'dars_adhrence_report_' + moment(new Date()).format('MM/DD/YYYY'),
        orientation: 'landscape',
        pageSize: 'LEGAL',
        content: [{text: 'zebra style', margin: [5, 5, 5, 5]},'columnGap: 2'],
        customize: function (doc) {
          
          doc['footer']=(function(page, pages) {
            return {
                columns: [
                  'Report Generated On: ' + moment(new Date()).format('MM/DD/YYYY hh:mm:ss A'),
                    {
                      // This is the center column
                      alignment: 'center',
                      text: 'Global Technology Solutions, LLC '
                    },
                    {
                        // This is the right column
                        alignment: 'right',
                        text: ['Page ', { text: page.toString() },  '/', { text: pages.toString() }]
                    }
                ],
                margin: [10, 0]
            }
          });
          doc['header']=(function() {
            return {
              columns: [
                {
                  image: 'data:image/jpeg;base64,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',
                  width: 50
                }
              ],
              margin: [35,20,0,0]
            }
          });
        }},
        {extend: 'print',
            customize: function (win){
                $(win.document.body).addClass('white-bg');
                $(win.document.body).css('font-size', '10px');

                $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
            }
        }
    ]);
  

    activate();

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
  };

}());
