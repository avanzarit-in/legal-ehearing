(function () {
  'use strict';

  var controllerId = "supervisorController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$scope', '$location', '$window', 'SweetAlert', '$interval', 'UserService', 'AnalyticService', 'HearingService', '$stateParams', supervisorController]);

  function supervisorController($rootScope, $scope, $location, $window, SweetAlert, $interval, UserService, AnalyticService, HearingService, $stateParams) {

    var vm = this;
    var reportSocket;

    vm.briefs=JSON.parse($window.localStorage.getItem('appealsList'));

    vm.flotOptions = AnalyticService.getFlotOptions();
    vm.polarOptions = AnalyticService.getPolarOptions();


    vm.login_phone_number = "";
    vm.username = "";
    vm.labelClass = "";
    vm.labelText = "";
    vm.agentstate = "";

    vm.hearing = [];

    vm.updatingHearings = false;

    vm.appeals = [];
    vm.userState = [];

    vm.report_start_dt;
    vm.report_end_dt;
    vm.report_role;


    vm.filter = {
      report_start_dt: '',
      report_end_dt: '',
      role: 'user',
      status: 'started'
    };


    vm.currentDate = new Date();

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'MM/dd/yyyy', 'shortDate'];
    vm.format = vm.formats[2];

    function activate() {
      console.log("Activate Supervisor Controller");

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

      getAppealsAllUser();
      getReportData();
      getUserState();

      vm.setupSockets();

     // $interval(function () {
        //Display the current time.
     //   getReportData();

    //  }, 10000);

    //  $interval(function () {
        //Display the current time.
      //  getUserState();

     // }, 10000);


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
            function (success) {
              console.log(success);
              $window.location.href = ("/");
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

    vm.processEvent = function (eventMsg) {

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

    vm.setupSockets = function () {

      var reConnect = false;

      reportSocket = io.sails.connect();

      reportSocket.on('connect', function (reason) {

        console.log('Supervisor Controller - The Server has connected');

        reportSocket.get('/v1/Accounts/dars/Conference/Socket/getId', function (msg) {
          console.log(' Supervisor Controller - My Socket ID is: ' + msg);
        });

        var roomName = UserService.getUsername();

        reportSocket.post('/v1/Accounts/dars/Conference/Socket/join', { roomName: roomName }, function (msg) {
          console.log(' Supervisor Controller - My Room is: ' + roomName);
          console.log(msg);
        });

        if (!reConnect) {

          console.log('This is normal connect');

        }
        else {

          console.log('This is re connect');

          vm.socket.post('/v1/Accounts/dars/Conference/Socket/refresh', {}, function (msg) {

            console.log(msg);

          });
        }

        reportSocket.on('devices', function (msg) {
          console.log(' Supervisor Controller - Added Listener: devices ');
          console.log(msg);
          vm.processEvent(msg);
        });

        reportSocket.on('calls', function (msg) {
          console.log(' Supervisor Controller - Added Listener: calls ');
          // processEvent(msg);

        });

      });

      reportSocket.on('disconnect', function (reason) {

        console.log(' Supervisor Controller - The Server has disconnected ' + reason);

      });
    };

    vm.logout = function () {
      UserService.logout().then(
        function (success) {
          console.log(success);
          $window.location.href = ("/");
        },
        function (error) {

        }
      )
    };

    vm.ready = function () {
      UserService.ready().then(
        function (success) {
          console.log(success);
        },
        function (error) {

        }
      )
    }

    vm.notready = function () {
      UserService.notready().then(
        function (success) {
          console.log(success);
        },
        function (error) {

        }
      )
    }

    var getAppealsAllUser = function(){

      HearingService.getHearingsAllUser().then(
        function (data) {
          console.log(data);
          vm.appeals = data;
        },
        function (error) {
          console.log(error);
          vm.appeals = [];
        });

    }

    var getReportData = function () {
      vm.updatingHearings = true;

      if (vm.report_start_dt) {
        vm.filter.report_start_dt = moment(vm.report_start_dt).format('MM/DD/YYYY');
      }

      if (vm.report_end_dt) {
        vm.filter.report_end_dt = moment(vm.report_end_dt).format('MM/DD/YYYY');
      }

      vm.filter.role = vm.report_role;

      AnalyticService.getReportData(vm.filter).then(

        function (data) {
          console.log(data);
          var processedData = [];

          vm.hearing = data;
          vm.updatingHearings = false;
        },
        function (error) {
          console.log(error);
        }
      );
    }

    
    var getUserState = function () {

      UserService.getUserState().then(
        function (data) {
          console.log(data);
          vm.userState = data;
        },
        function (error) {
          console.log(error);
          vm.userState = [];
        });

    }

    activate();

    /**
     * Definition of variables
     * Flot chart
     */
    vm.flotData = function(){
      
      var data1 = [
        [0, 4],
        [1, 8],
        [2, 5],
        [3, 10],
        [4, 4],
        [5, 16],
        [6, 5],
        [7, 11],
        [8, 6],
        [9, 11],
        [10, 30],
        [11, 10],
        [12, 13]
      ];

      return [data1];

      
    };

    vm.polarData = function(){ 
      
        var polarData = [
        {
          value: 300,
          color: "#a3e1d4",
          highlight: "#1ab394",
          label: "Completed"
        },
        {
          value: 140,
          color: "#dedede",
          highlight: "#1ab394",
          label: "In Progress"
        }
      ];

      return polarData;
  };


    vm.processTime = function (time_string, format) {

      var startTime = moment(time_string, "hh:mm:ss A");
      var currentTime = moment(new Date(), "hh:mm:ss A");
      var duration = moment.duration(currentTime.diff(startTime));

      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) - hours * 60;
      var seconds = parseInt(duration.asSeconds()) - (parseInt(duration.asMinutes())) * 60;

      console.log(hours + ':' + minutes + ':' + seconds);

      if (hours < 10) {

        hours = '0' + hours;
      }

      if (minutes < 10) {

        minutes = '0' + minutes;
      }

      if (seconds < 10) {

        seconds = '0' + seconds;

      }

      var newTimeFormat;

      if (format === 'hours') {

        newTimeFormat = hours;

      }
      else if (format === 'minutes') {

        newTimeFormat = minutes;

      }
      else if (format === 'seconds') {

        newTimeFormat = seconds;

      }
      else {

        newTimeFormat = hours + ':' + minutes + ':' + seconds;
      }

      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
    }

    vm.processDate = function (date_string) {
      var momentObj = moment(date_string);

      //console.log(momentObj);

      var monthDayWhen = momentObj.format('MM.DD');
      var monthDayToday = moment().format('MM.DD');

      return date_string;
    }

    vm.formatTime = function (date_string, time_string) {
      var momentObj = moment(date_string + ' ' + time_string);

      //console.log(momentObj);

      var newTimeFormat = momentObj.format('hh:mm:ss A');

      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
    }

    vm.duration = function (time_string) {

      var startTime = moment(time_string, "hh:mm:ss A");
      var currentTime = moment(new Date(), "hh:mm:ss A");
      var duration = moment.duration(startTime.diff(currentTime));

      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) - hours * 60;
      var seconds = parseInt(duration.asSeconds()) - (parseInt(duration.asMinutes())) * 60;

      var agoFrom = '';

      if (hours < 0) {

        hours = hours * (-1);
        agoFrom = 'ago';
      }
      else {
        agoFrom = 'from now';
      }

      if (minutes < 0) {

        minutes = minutes * (-1);
        agoFrom = 'ago';
      }
      else {
        agoFrom = 'from now';
      }

      if (seconds < 0) {

        seconds = seconds * (-1);
        agoFrom = 'ago';

      }
      else {
        agoFrom = 'from now';
      }

      if (hours < 10) {

        hours = '0' + hours;
      }

      if (minutes < 10) {

        minutes = '0' + minutes;
      }

      if (seconds < 10) {

        seconds = '0' + seconds;

      }

      var newTimeFormat;

      newTimeFormat = hours + ':' + minutes + ':' + seconds + ' ' + agoFrom;


      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
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
        closeOnCancel: false
      },
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
