(function () {
  'use strict';

  var controllerId = "conferenceController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$scope', '$location', '$window', 'SweetAlert', 'UserService', 'HearingService', 'ConferenceService', '$stateParams', 'HttpService', '$interval', '$timeout', '$uibModal', conferenceController]);

  function conferenceController($rootScope, $scope, $location, $window, SweetAlert, UserService, HearingService, ConferenceService, $stateParams, HttpService, $interval, $timeout, $uibModal) {
    var vm = this;

    var lastParticipantName = 4;
    var processEvent;
    var confSocket;

    vm.viewAll = false;
    vm.hearingStarted = false;

    vm.okNotes = false;
    vm.okDisposition = false;

    vm.briefs = JSON.parse($window.localStorage.getItem('appealsList'));
    vm.talkingStarted = false;

    // Local Recording - Media Server
    //

    vm.msRecStarted = false;
    vm.msRecFile = false;
    vm.msRecDownload = '';
    vm.msRecbtnClass = 'text-primary';
    vm.msRecStatus = 'Recording Starting';

    vm.muteAllActive = false;
    vm.holdAllActive = false;

    vm.appealDetail;
    vm.conference_sid;
    vm.participant_sid;
    vm.hold_conference_sid;

    vm.labelClass = "";
    vm.labelText = "";
    vm.agent_state = "";
    // used only for the hearing officer
    vm.hearingActive = true;
    vm.muteActive = false;
    vm.holdActive = false;

    vm.login_phone_number = UserService.getLoginPhoneNumber();
    vm.user_name = UserService.getUsername();
    vm.agent_first_name = UserService.getAgentFirstName();
    vm.agent_last_name = UserService.getAgentLastName();
    vm.agent_location = UserService.getAgentLocation();
    vm.user_id = UserService.getUserId();
    vm.tenant_id = UserService.getTenantId();

    vm.dispCode = JSON.parse($window.localStorage.getItem('disp_code'));

    vm.dockNotes = [].join('');
    
    vm.elapsedTime = "00:00:00";

    vm.elapsedTimeSec = "00";
    vm.elapsedTimeMin = "00";
    vm.elapsedTimeHour = "00";

    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    var timerIntervalId;

    /*
    vm.participants = [
      {name: 1, phone: '704.456.5012'},
      {name: 2, phone: '704.248.2747'},
      {name: 3, phone: '704.249.2747'},
      {name: 4, phone: '704.254.2747'},
      {name: 5, phone: '704.416.5012'},
      {name: 6, phone: '704.251.2747'},
      {name: 7, phone: '704.240.2747'},
      {name: 8, phone: '704.342.5012'},
      {name: 9, phone: '704.501.2747'},
      {name: 10, phone: '704.608.2747'},
      {name: 11, phone: '704.611.5012'},
      {name: 12, phone: '704.832.2747'},
      {name: 13, phone: '704.490.2747'},
      {name: 14, phone: '704.981.2747'},
      {name: 15, phone: '704.791.2747'}
    ];*/

    vm.participants = [];

    vm.activeParticipants = [];

    vm.newParticipant = {
      first_name: '',
      last_name: '',
      home: '',
      mobile: '',
      work: '',
      party_code: '',
      party_desc: '',
      business_name: ''
    };

    vm.newRecTag = {
      label: '',
      description: ''
    };

    function activate() {
      var docket_id = $stateParams.docket_id;

      vm.appealDetail = HearingService.getHearingByDocketId(docket_id);

      console.log(vm.appealDetail);

      if (!(typeof vm.appealDetail === 'undefined')) {

        vm.participants = vm.appealDetail.participants;
        console.log(vm.appealDetail.participants);
      }




      /*
      business_name: "NA"
      createdAt: null
      docket_number: 131313
      extension: null
      first_name: "Shyam"
      id: 2
      last_name: "Agaral"
      middle_name: "P"
      partyType_cd: 123
      partyType_desc: "Claimant"
      party_id: 2
      phone_number: "5726"
      updatedAt: null
      */

      vm.agent_state = UserService.getAgentState();

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

      vm.setupSockets();


    }

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function incrementHours() {
      hours++;
    };

    function incrementMinutes() {
      ++minutes;

      if (minutes === 60) {
        minutes = 0;

        incrementHours();
      }
    };

    function updateTime() {

      ++seconds;

      if (seconds === 60) {
        seconds = 0;

        incrementMinutes();
      }

      vm.elapsedTime = pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);

      vm.elapsedTimeSec = pad(seconds, 2);
      vm.elapsedTimeMin = pad(minutes, 2);
      vm.elapsedTimeHour = pad(hours, 2);

    };

    function startHearingTimer() {
      timerIntervalId = $interval(function () {

        updateTime();

      }, 1000); // every 1s
    };

    function endHearingTimer() {
      $interval.cancel(timerIntervalId);
      vm.elapsedTime = "00:00:00";
      vm.elapsedTimeSec = "00";
      vm.elapsedTimeMin = "00";
      vm.elapsedTimeHour = "00";
      seconds = 0;
      minutes = 0;
      hours = 0;
    };

    function isString(value) {
      return typeof value === 'string' || value instanceof String;
    };

    /**
     * Expected Properties
     *
     * {"event":"Bridge","status":"started","conference_sid":"78fd88b113cd4225b5b0bd66f704f2c6","name":"","user_id":"7044565012"}
     * {"event":"Bridge","status":"ended","conference_sid":"f428a7e838934bef8cde57ce5fa785f6","name":"","user_id":"7044565012"}
     *
     * @param {*} eventObj
     */
    function processBridgeEvent(eventObj) {
      if (eventObj['status'] === "started") {

        vm.conference_sid = eventObj['conference_sid'];
        vm.participant_sid = eventObj['participant_sid'];

        $scope.$apply(function () {
          vm.hearingStarted = true;
          vm.hearingActive = true;
          vm.msRecFile = false;
          vm.msRecDownload = '';
          vm.okNotes = true;
          vm.okDisposition = true;

        });

        //startHearingTimer();
      }
      else {
        vm.hearingStarted = false;
        $scope.$apply(function () {

          vm.msRecStarted = false;
          vm.msRecbtnClass = 'text-primary';
          vm.msRecStatus = 'Recording Starting';
        });
        //endHearingTimer();
        
      }

    }

    /**
    * Expected Properties
    *
    * {"event":"LocalRecording","status":"yes","user_id":"7044565012","phone":"7044565012"}
    *
    *
    * @param {*} eventObj
    */
    function processLocalRecordingEvent(eventObj) {

      if (eventObj['status'] === "started") {

        $scope.$apply(function () {
          vm.msRecStarted = true;
          vm.msRecbtnClass = 'text-danger fa-spin';
          vm.msRecStatus = 'Recording Started';
        });

        startHearingTimer();
      }
      else if (eventObj['status'] === "finished") {
        $scope.$apply(function () {
          vm.msRecStarted = false;
          vm.msRecbtnClass = 'text-primary';
          vm.msRecStatus = 'Recording Ended';
        });

        endHearingTimer();
      }
      else if (eventObj['status'] === "failed") {
        $scope.$apply(function () {
          vm.msRecStarted = false;
          vm.msRecbtnClass = 'text-primary';
          vm.msRecStatus = 'Recording Failed';
        });

        endHearingTimer();
      }
      else if (eventObj['status'] === "file") {
        console.log(eventObj);
        $scope.$apply(function () {
          vm.msRecFile = true;
          // vm.msRecDownload = '/audio/' + eventObj['filename']; 
          vm.msRecDownload = eventObj['filename'];
        });
        console.log(vm.msRecDownload);
      }
      else {
        console.log('No Status condition mapped');
      }

    }


    /**
     * Expected Properties
     *
     * {"event":"Channel","status":"joined","participant_sid":"1514314480.945","conference_sid":"7ff611a57c9d463b846d8eb53dd38280","user_id":"7044565012","role":"announcer"}
     * {"event":"Channel","status":"left","participant_sid":"1514314757.963","conference_sid":"f428a7e838934bef8cde57ce5fa785f6","user_id":"7044565012","role":"announcer"}
     * {"event":"Channel","status":"joined","participant_sid":"1514314488.949","conference_sid":"7ff611a57c9d463b846d8eb53dd38280","user_id":"7044565012","role":"participant"}
     *
     * @param {*} eventObj
     */
    function processChannelEvent(eventObj) {

      console.log(eventObj);

      switch (eventObj['status']) {

        case 'joined':

          _addParticipantToActiveListOnEvent(eventObj['participant_sid']);

          break;

        case 'ANSWER':

          _participantOnEventAnswer(eventObj['participant_sid']);

          break;

        case 'RINGING':

          _participantOnEventRinging(eventObj['participant_sid']);

          break;

        case 'dropped':

          _removeActiveParticipantOnEvent(eventObj['participant_sid']);

          break;

        case 'left':

          _removeActiveParticipantOnEvent(eventObj['participant_sid']);

          break;

        case 'TalkingStarted':

          _participantOnEventTalking(eventObj['participant_sid'], 'Started');

          break;

        case 'TalkingFinished':

          _participantOnEventTalking(eventObj['participant_sid'], 'Finished');

          break;

      }

    }

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

    processEvent = function (eventMsg) {
      var eventObj = eventMsg;

      console.log(eventMsg);

      if (isString(eventMsg)) {
        eventObj = JSON.parse(eventMsg);
      }

      switch (eventObj['event']) {
        case "Bridge":
          processBridgeEvent(eventObj);
          break;

        case "Channel":
          processChannelEvent(eventObj);
          break;

        case "LocalRecording":
          processLocalRecordingEvent(eventObj);
          break;

        case "Device":
          processDeviceEvent(eventObj);
          break;
      }
    };

    vm.setupSockets = function () {

      var reConnect = false;

      confSocket = io.sails.connect();

      confSocket.on('connect', function (reason) {

        console.log('Conference Controller - The Server has connected');

        confSocket.get('/v1/Account/dars/Socket/getId', function (msg) {
          console.log(' Conference Controller - My Socket ID is: ' + msg);
        });

        var roomName = UserService.getUsername();

        confSocket.post('/v1/Account/dars/Socket/join', { roomName: roomName }, function (msg) {
          console.log(' Conference Controller - My Room is: ' + roomName);
          console.log(msg);
        });

        if (!reConnect) {

          console.log('This is normal connect');

        }
        else {

          console.log('This is re connect');

          vm.socket.post('/v1/Account/dars/Socket/refresh', {}, function (msg) {

            console.log(msg);

          });
        }

        confSocket.on('hearing', function (msg) {
          console.log('Added Listener: hearing ');
          processEvent(msg);
        });

        confSocket.on('devices', function (msg) {
          console.log(' Conference Controller - Added Listener: devices ');
          console.log(msg);
          processEvent(msg);
        });

        confSocket.on('calls', function (msg) {
          console.log(' Conference Controller - Added Listener: calls ');
          // processEvent(msg);

        });

      });

      confSocket.on('disconnect', function (reason) {

        console.log(' Conference Controller - The Server has disconnected ' + reason);

      });
    };

    vm.addParticipant = function () {

      var addNewParticipant = [];

      addNewParticipant = {
        first_name: vm.newParticipant.first_name,
        last_name: vm.newParticipant.last_name, // should the modal be broken up to request first/last name?
        home: vm.newParticipant.home,
        mobile: vm.newParticipant.mobile,
        work: vm.newParticipant.work,
        work_extension: vm.newParticipant.extension,
        party_code: vm.newParticipant.party_code,
        party_desc: vm.newParticipant.party_desc,
        business_name: vm.newParticipant.business_name,
        docket_number: vm.appealDetail.docket_number
      }

      HearingService.addNewParty(addNewParticipant).then(
        function (responseData) {

          console.log(responseData);

          var participant = [];

          var participant = {
            first_name: addNewParticipant.first_name,
            last_name: addNewParticipant.last_name, // should the modal be broken up to request first/last name?
            home: addNewParticipant.home,
            mobile: addNewParticipant.mobile,
            work: addNewParticipant.work,
            extension: addNewParticipant.extension,
            party_code: addNewParticipant.party_code,
            party_desc: addNewParticipant.party_desc,
            business_name: addNewParticipant.business_name,
            id: responseData.id,
            connected: false,
            mute: false,
            hold: false
          }

          console.log(participant);

          vm.participants.push(participant);
        },
        function (error) {
          console.log(error);
        }
      );

      vm.newParticipant = {
        first_name: '',
        last_name: '',
        home: '',
        mobile: '',
        work: '',
        party_code: '',
        party_desc: '',
        business_name: '',
        extension: ''
      };
    };

    function _removeActiveParticipant(participant_sid) {

      console.log('In _removeActiveParticipant');

      for (var i = 0; i < vm.participants.length; ++i) {
        var activeParticipant = vm.participants[i];

        if (activeParticipant.participant_sid === participant_sid) {

          console.log(activeParticipant);

          vm.participants[i].connected = false;
          vm.participants[i].mute = false;
          vm.participants[i].hold = false;
          vm.participants[i].participantStatus = 'Disconnected';
        }
      }
    };

    function _removeActiveParticipantOnEvent(participant_sid) {

      console.log('In _removeActiveParticipantOnEvent');

      for (var i = 0; i < vm.participants.length; ++i) {
        var activeParticipant = vm.participants[i];

        if (activeParticipant.participant_sid === participant_sid) {

          console.log(activeParticipant);

          $scope.$apply(function () {
            vm.participants[i].connected = false;
            vm.participants[i].ringing = false;
            vm.participants[i].mute = false;
            vm.participants[i].hold = false;
            vm.participants[i].participantStatus = 'Disconnected';
          });

        }
      }
    };

    function _participantOnEventRinging(participant_sid) {
      // Move the participant from the to-add list to the active participants list

      var participants_length = vm.participants.length;

      console.log('In _participantOnEventRinging ' + participant_sid);

      for (var i = 0; i < vm.participants.length; ++i) {
        var participant = vm.participants[i];

        if (participant.participant_sid === participant_sid) {

          console.log(' Participant SID: ' + participant_sid);
          console.log(participant);

          vm.participants[i].participant_sid = participant_sid;

          $scope.$apply(function () {

            vm.participants[i].ringing = true;

          });

        }
      }
    }

    function _participantOnEventAnswer(participant_sid) {
      // Move the participant from the to-add list to the active participants list

      var participants_length = vm.participants.length;

      console.log('In _participantOnEventAnswer');

      for (var i = 0; i < vm.participants.length; ++i) {
        var participant = vm.participants[i];

        if (participant.participant_sid === participant_sid) {

          console.log(' Participant SID: ' + participant_sid);
          console.log(participant);

          vm.participants[i].participant_sid = participant_sid;

          $scope.$apply(function () {
            vm.participants[i].connected = true;
          });

        }
      }
    }

    function _participantOnEventTalking(participant_sid, status) {

      console.log('In _participantOnEventTalking - ' + participant_sid + ' - ' + status);

      var participants_length = vm.participants.length;

      if (status === 'Started') {

        if (vm.participant_sid === participant_sid) {

          vm.talkingStarted = true;

        }
        else {

          for (var i = 0; i < vm.participants.length; ++i) {
            var participant = vm.participants[i];

            if (participant.participant_sid === participant_sid) {

              console.log(' Participant SID Started Talking: ' + participant_sid);
              console.log(participant);

              $scope.$apply(function () {
                vm.participants[i].talking = true;
              });

            }
          }
        }
      }
      else {

        if (vm.participant_sid === participant_sid) {

          vm.talkingStarted = false;

        }
        else {

          for (var i = 0; i < vm.participants.length; ++i) {
            var participant = vm.participants[i];

            if (participant.participant_sid === participant_sid) {

              console.log(' Participant SID Stopped Talking: ' + participant_sid);
              console.log(participant);

              $scope.$apply(function () {
                vm.participants[i].talking = false;
              });

            }
          }
        }

      }
    }

    function _addParticipantToActiveListOnEvent(participant_sid) {
      // Move the participant from the to-add list to the active participants list

      var participants_length = vm.participants.length;

      console.log('****In _addParticipantToActiveListOnEvent*****');

      for (var i = 0; i < vm.participants.length; ++i) {
        var participant = vm.participants[i];

        if (participant.participant_sid === participant_sid) {

          console.log(participant);

          vm.participants[i].participant_sid = participant_sid;

          $scope.$apply(function () {
            vm.participants[i].connected = true;
          });

        }
      }
    }

    function _addParticipantToActiveList(strId, participant_sid) {
      // Move the participant from the to-add list to the active participants list

      var participants_length = vm.participants.length;

      console.log('***** In _addParticipantToActiveList *****');

      for (var i = 0; i < vm.participants.length; ++i) {
        var participant = vm.participants[i];

        if (participant.id === strId) {

          console.log(participant);

          vm.participants[i].participant_sid = participant_sid;
          vm.participants[i].ringing = true;
          //vm.participants[i].connected = true;

        }
      }
    };

    function _removeParticipantCard(strId) {

      var index = 0;

      console.log('In _removeParticipantCard');

      for (var i = 0; i < vm.participants.length; ++i) {

        var activeParticipant = vm.participants[i];

        if (activeParticipant.id === strId) {

          console.log(activeParticipant);

          index = i;
          i = vm.participants.length;
          vm.participants.splice(index, 1);

        }
      }
    };

    /**
     * Adds a participant to the active participants list.
     *
     * Each participant requires a unique phone number.
     */
    $scope.$on('addedParticipant', function (event, data) {
      event.preventDefault();
      event.stopPropagation();
      // TODO

      console.log('***** In addedParticipant *****');

      console.log(event);
      console.log(data);


      var participant = new ParticipantModel();

      participant.conference_sid = vm.conference_sid;
      participant.docket_number = vm.appealDetail.docket_number;
      participant.first_name = data.first_name;
      participant.middle_name = data.middle_name;
      participant.last_name = data.last_name;
      participant.member_phone = data.phone_number;
      participant.party_code = data.party_code;
      participant.party_desc = data.party_desc;
      participant.party_id = data.party_id;
      participant.business_name = data.business_name;
      participant.extension = data.extension;
      participant.announcer_sid = vm.participant_sid;

      

      ConferenceService.addParticipant(participant).then(
        function (responseData) {

          console.log(responseData);

          var participant_sid = '';
          participant_sid = responseData.participant_sid;

          _addParticipantToActiveList(data.id, participant_sid);
        },
        function (error) {
          console.log(error);
        }
      );


    });

    vm.addParticipantModal = function () {
      var options = {
        templateUrl: '/app/conference/addParticipantModal.html',
        controller: 'addParticipantModalController',
        controllerAs: 'vm',
        size: 'lg'
      }
      var modalInstance = $uibModal.open(options);

      modalInstance.result.then(function (data) {

        console.log(data);
        vm.newParticipant = data;

        vm.addParticipant();

      }, function () {
        console.log("Modal Dismissed.");
      })

      modalInstance.close(function (data) {

      });

      modalInstance.dismiss(function (data) {

      });
    }

    vm.phoneKeypadModal = function () {
      var options = {
        templateUrl: '/app/conference/phoneKeypadModal.html',
        controller: 'phoneKeypadModalController',
        controllerAs: 'vm',
        size: 'sm'
      }
      var modalInstance = $uibModal.open(options);

      modalInstance.result.then(function (data) {

        console.log(data);

      }, function () {
        console.log("Modal Dismissed.");
      })

      modalInstance.close(function (data) {

      });

      modalInstance.dismiss(function (data) {

      });
    }


    activate();

    $scope.$on('dialDigits', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      console.log(data);

      var options = {
        templateUrl: '/app/conference/phoneKeypadModal.html',
        controller: 'phoneKeypadModalController',
        controllerAs: 'vm',
        size: 'sm'
      }

      var modalInstance = $uibModal.open(options);

      modalInstance.result.then(function (result) {

        if (result) {
          console.log('In Dial Digits');

          ConferenceService.dtmf(vm.conference_sid, data.participant_sid, result.digits).then(
            function (data) {
              console.log(data);
            },
            function (error) {
              console.log(error);
            }
          )
        }

      }, function () {
        console.log("Modal Dismissed.");
      })

      modalInstance.close(function (result) {

      });

      modalInstance.dismiss(function (result) {

      });

    });

    $scope.$on('remove', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      console.log('Removing Participant');

      console.log(data);

      HearingService.removeParty(data.id).then(
        function (success) {
          console.log(success);
          _removeParticipantCard(success.id);
        },
        function (error) {
          console.log(error);
        }
      )
    });

    $scope.$on('dtmf', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      console.log(data);

      if (data.dtmf) {
        console.log('In dtmf');

        ConferenceService.dtmf(vm.conference_sid, data.participant_sid, data.dtmf).then(
          function (data) {
            console.log(data);
          },
          function (error) {
            console.log(error);
          }
        )
      }
    });

    $scope.$on('mute', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      if (data.mute) {
        ConferenceService.unmuteParticipant(vm.conference_sid, data.participant_sid, 'in').then(
          function (data) {
            var participant_sid = data.participant_sid;

            for (var i = 0; i < vm.participants.length; ++i) {
              var activeParticipant = vm.participants[i];

              if (typeof activeParticipant.participant_sid !== 'undefined' && activeParticipant.participant_sid === participant_sid) {
                vm.participants[i].mute = false;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        )
      }
      else {
        ConferenceService.muteParticipant(vm.conference_sid, data.participant_sid).then(
          function (data) {
            var participant_sid = data.participant_sid;

            for (var i = 0; i < vm.participants.length; ++i) {
              var activeParticipant = vm.participants[i];

              if (typeof activeParticipant.participant_sid !== 'undefined' && activeParticipant.participant_sid === participant_sid) {
                vm.participants[i].mute = true;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        )
      }
    });

    $scope.$on('hold', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      if (data.hold) {
        ConferenceService.unholdParticipant(vm.conference_sid, data.participant_sid, data.hold_conference_sid).then(
          function (data) {
            var participant_sid = data.participant_sid;

            for (var i = 0; i < vm.participants.length; ++i) {
              var activeParticipant = vm.participants[i];

              if (typeof activeParticipant.participant_sid !== undefined && activeParticipant.participant_sid === participant_sid) {
                vm.participants[i].hold = false;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        )
      }
      else {
        ConferenceService.holdParticipant(vm.conference_sid, data.participant_sid).then(
          function (data) {
            var participant_sid = data.participant_sid;

            for (var i = 0; i < vm.participants.length; ++i) {
              var activeParticipant = vm.participants[i];

              if (typeof activeParticipant.participant_sid !== undefined && activeParticipant.participant_sid === participant_sid) {
                vm.participants[i].hold = true;
                vm.participants[i].hold_conference_sid = data.hold_conference_sid;
              }
            }
          },
          function (error) {
            console.log(error);
          }
        )
      }
    });

    $scope.$on('hangup', function (event, data) {
      event.preventDefault();
      event.stopPropagation();

      ConferenceService.hangupParticipant(vm.conference_sid, data.participant_sid, data.phone_number).then(
        function (response) {
          _removeActiveParticipant(data.id, data.participant_sid);
        },
        function (error) {
          console.log(error);
        }
      )


    });

    vm.muteAll = function () {
      ConferenceService.muteAllParticipants(vm.conference_sid, 'in').then(
        function (data) {
          console.log(data);
          vm.muteAllActive = true;
          $scope.$broadcast('mute_all', {});
        },
        function (error) {
          console.log(error);
        }
      )

    }

    vm.unmuteAll = function () {
      ConferenceService.unmuteAllParticipants(vm.conference_sid, 'in').then(
        function (data) {
          console.log(data);
          vm.muteAllActive = false;
          $scope.$broadcast('unmute_all', {});
        },
        function (error) {
          console.log(error);
        }
      )

    }

    vm.holdAll = function () {
      ConferenceService.holdAllParticipants(vm.conference_sid).then(
        function (data) {
          console.log(data);
          vm.hold_conference_sid = data.hold_conference_sid;
          vm.holdAllActive = true;
          $scope.$broadcast('hold_all', {});
        },
        function (error) {
          console.log(error);
        }
      )
    }

    vm.unholdAll = function () {
      ConferenceService.unholdAllParticipants(vm.conference_sid, vm.hold_conference_sid).then(
        function (success) {
          vm.holdAllActive = false;
          $scope.$broadcast('unhold_all', {});
        },
        function (error) {
          console.log(error);
        }
      )
    }

    var hangupAll = function () {
      if (!vm.activeParticipants.length) {
        for (var i = 0; i < vm.participants.length; ++i) {
          var participant = vm.participants[i];

          if (participant.connected) {

            console.log(' Participant Status is ' + participant.participantStatus);

            participant.muted = false;
            participant.hold = false;
            participant.connected = false;
            participant.participantStatus = 'Disconnected';

          }
        }

        console.log('In Hangup All');

      }
      else {
        var activeParticipant = vm.activeParticipants.pop();
        // vm.participants.push(activeParticipant);
        vm.activeParticipants.splice(0, 1);

      }

      vm.hangupAll();
      return;
    }

    vm.hangupAll = function () {
      console.log('In VM.Hangup All');
      console.log(vm.conference_sid);
      ConferenceService.hangupAllParticipants(vm.conference_sid).then(
        function (success) {
          console.log(success);
        },
        function (error) {
          console.log(error);
        }
      )
    };

    vm.startHearing = function () {
      console.log('Hearing Started');

      if (HttpService.testing()) {
        vm.hearingStarted = true;
        vm.okNotes = false;
        vm.okDisposition = false;

        return;
      }

      ConferenceService.startHearing(vm.appealDetail.docket_number).then(
        function (data) {
          /**
           * {
           *   statusCode
           *   statusMessage
           *   conference_sid
           *   participant_sid
           *   role
           * }
           */
          vm.hearingActive = false;
          vm.msRecFile = false;
          
          $interval(function () {
            vm.hearingActive = true;
          }, 10000, false);


          console.log(data);

          //vm.conference_sid = data.conference_sid;
          //vm.participant_sid = data.participant_sid;

          //startHearingTimer();

        },
        function (error) {
          console.log(error);
        }
      );
    };
    /*
        vm.endHearing = function () {
    
          console.log('In End Hearing');
    
          if (HttpService.testing()) {
            vm.hearingStarted = false;
    
            return;
          }
    
          ConferenceService.endHearing(vm.conference_sid).then(
            function (success) {
              console.log(vm.conference_sid);
            },
            function (error) {
    
            }
          );
        };
    */
    vm.endHearing = function () {

      console.log('In End Hearing');

      if (HttpService.testing()) {
        vm.hearingStarted = false;

        return;
      }

      ConferenceService.hangupParticipant(vm.conference_sid, vm.participant_sid, '').then(
        function (response) {
          //_removeActiveParticipant(data.id,data.participant_sid);
          console.log(' Hearing ' + vm.conference_sid + 'Hung Up by ' + vm.participant_sid);

          endHearingTimer();
        },
        function (error) {
          console.log(error);
        }
      )
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

    vm.mute = function () {

      if (vm.muteActive) {
        ConferenceService.unmuteParticipant(vm.conference_sid, vm.participant_sid, 'in').then(
          function (data) {
            vm.muteActive = false;
            //vm.muteAllActive = false;
          },
          function (error) {
            console.log(error);
          }
        )
      }
      else {
        ConferenceService.muteParticipant(vm.conference_sid, vm.participant_sid).then(
          function (data) {
            vm.muteActive = true;
            // vm.muteAllActive = true;
          },
          function (error) {
            console.log(error);
          }
        )
      }
    };

    vm.hold = function () {

      if (vm.holdActive) {
        ConferenceService.unholdParticipant(vm.conference_sid, vm.participant_sid, vm.hold_conference_sid).then(
          function (data) {
            vm.holdActive = false;
            //vm.holdAllActive = false;
          },
          function (error) {
            console.log(error);
          }
        )
      }
      else {
        ConferenceService.holdParticipant(vm.conference_sid, vm.participant_sid).then(
          function (data) {
            vm.holdActive = true;
            // vm.holdAllActive = true;
            vm.hold_conference_sid = data.hold_conference_sid;
          },
          function (error) {
            console.log(error);
          }
        )
      }
    };

    vm.hangupAllAlert = function () {
      SweetAlert.swal({
        title: "Are you sure?",
        text: "You are about to hangup on all participants!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, hangup all!",
        cancelButtonText: "No, cancel the request!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            hangupAll();
            SweetAlert.swal("Done!", "You have successfully disconnected all participants", "success");
          } else {
            SweetAlert.swal("Cancelled", "Your participants are safe :)", "error");
          }
        });
    };

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

    vm.setDispositionCode = function () {

      var updDispCode = {
        code: $scope.dispCode.code,
        tenant_id: vm.tenant_id,
        user_id: vm.user_id,
        name: $scope.dispCode.name,
        conference_sid: vm.conference_sid
      }

      console.log(updDispCode);

      ConferenceService.setDispCode(updDispCode).then(
        function (responseData) {

          console.log(responseData);

        },
        function (error) {
          console.log(error);
        }
      );

    }

    vm.clearNotes = function () {
      
      vm.dockNotes = [].join('');

    }

    vm.saveNotes = function () {
      
      var addNewNotes = {
        conference_sid: vm.conference_sid,
        notes: vm.dockNotes,
        tenant_id: vm.tenant_id,
        user_id: vm.user_id
      }

      ConferenceService.addNewNotes(addNewNotes).then(
        function (responseData) {

          console.log(responseData);

        },
        function (error) {
          console.log(error);
        }
      );
      
    }

    vm.processDate = function (date_string) {
      var momentObj = moment(date_string);

      //console.log(momentObj);

      var monthDayWhen = momentObj.format('MM.DD');
      var monthDayToday = moment().format('MM.DD');

      return date_string;
    }

    vm.processTime = function (date_string, time_string) {
      var momentObj = moment(date_string + ' ' + time_string);

      //console.log(momentObj);

      var newTimeFormat = momentObj.format('hh:mm:ss A');

      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
    }

    vm.addRecTagModal = function () {

      console.log('Timer is at ' + vm.elapsedTime);

      var timeArray = vm.elapsedTime.split(':');
      var seconds = 60*60*timeArray[0] + 60*timeArray[1] + timeArray[2];

      var options = {
        templateUrl: '/app/conference/addRecTagModal.html',
        controller: 'addRecTagModalController',
        controllerAs: 'vm',
        size: 'sm'
      }
      var modalInstance = $uibModal.open(options);

      modalInstance.result.then(function (data) {

        vm.newRecTag = data;

        vm.addRecTag(seconds);

      }, function () {
        console.log("Modal Dismissed.");
      })

      modalInstance.close(function (data) {

      });

      modalInstance.dismiss(function (data) {

      });
    };

    vm.addRecTag = function (seconds) {

      var addTag = {
        'label': vm.newRecTag.label,
        'description': vm.newRecTag.description,
        'user_id': vm.user_id,
        'tenant_id': vm.tenant_id,
        'conference_sid': vm.conference_sid,
        'taggedat': parseInt(seconds,10)
      };

      console.log(addTag);

      ConferenceService.addNewRecTag(addTag).then(
        function (responseData) {

          console.log(responseData);

        },
        function (error) {
          console.log(error);
        }
      );

      vm.newRecTag = {
        label: '',
        description: ''
      };

    };


  }

}());
