(function () {
  'use strict';

  var serviceId = 'ConferenceService';

  angular.module('inspinia').factory(serviceId, ['$http', '$q', '$window', 'HttpService', ConferenceService]);

  function ConferenceService($http, $q, $window, HttpService) {

    /**
     * POST /v1/Account/<authid>/Conference/ready
     *
     * Changes the state of the Agent to Ready from Not Ready States.
     * Attempts to login an agent (if logged off), and changes the state to ready.
     */
    var ready = function () {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/ready';

      var data = {}

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
     * POST /v1/Account/<authid>/Conference/notready
     *
     * Changes the state of the Agent to Not Ready from Ready States.
     * Attempts to login an agent (if logged off), and changes the state to ready.
     */
    var notReady = function () {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/notready';

      var data = {}

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
    * POST /v1/Account/<authid>/Conference/start
    *
    * Creates a bridge and dials the hearing officer's extension on Cisco via SIP
    * Attaches business data to the call.
    *
    * @param {Object} hearingModel   An object model containing all of the parameters needed for a hearing to start
    */
    
    var startHearing = function (docket_number) {

      var deferred = $q.defer();
      var baseUrl = HttpService.getBaseUrl();
      var authId = 'dars';
      var url = baseUrl + '/v1/Account/' + authId + '/Conference/start';
      var phone_number = $window.localStorage.getItem('phone_number');

      var data = {
        docket_number: docket_number,
        member_phone: phone_number,
        role: 'announcer'
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
     * POST /v1/Account/<authid>/Conference/Member/add
     *
     * Dials a participant via SIP Trunk to Cisco.
     * Adds the participant on the hearing bridge.
     *
     * @param {Object} participantModel   An object model containing all of the parameters needed for a participant to join
     */
    var addParticipant = function (participantModel) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/add';

      if (HttpService.testing()) {
        var data = {
          "statusCode": "0",
          "statusMessage": "Participant added to the conference",
          "conference_sid": "b1de058d-f3f5-4b1b-9ad5-481cf6248381",
          "participant_sid": "1513690520.1380" + Date.now()
        }

        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

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
     * POST /v1/Account/<authid>/Conference/Member/Participant_Id/dtmf
     *
     * Send DTMF to a participant channel 
     * to enter phone extension or other DTMF menu
     *
     * @param {string} conference_sid     Conference id for the hearing currently in progress.
     * @param {string} participant_sid    Participant id to hold
     * @param {string} dtmf_digits        DTMF Digits to send
     */
    var dtmf = function (conference_sid, participant_sid, dtmf_digits) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/' + participant_sid + '/dtmf';

      var data = {
        conference_sid: conference_sid,
        dtmf_digits: dtmf_digits,
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * POST /v1/Account/<authid>/Conference/Member/mute
     *
     * Mute a participant i.e. participant can hear but not be heard.
     *
     * @param {string} conference_sid     Conference id for the hearing currently in progress
     * @param {string} participant_sid    Participant id to mute
     * @param {string} direction          Direction to mute - e.g. in, out or both
     */
    var muteParticipant = function (conference_sid, participant_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/mute';

      var data = {
        conference_sid: conference_sid,
        participant_sid: participant_sid,
        direction: 'in'
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * DELETE /v1/Account/<authid>/Conference/Member/mute
     *
     * Unmute a muted participant.
     *
     * @param {string} conference_sid     Conference id for the hearing currently in progress
     * @param {string} participant_sid    Participant id to mute
     * @param {string} direction          Direction to mute - e.g. in, out or both
     */
    var unmuteParticipant = function (conference_sid, participant_sid, direction) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/mute';

      var data = {
        conference_sid: conference_sid,
        participant_sid: participant_sid,
        direction: 'in'
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

      $http.delete(url, { data: data }).then(
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
     * POST /v1/Account/<authid>/Conference/Member/mute_all
     *
     * Mute all participants in a conference i.e. participants can hear but not be heard.
     *
     * @param {string} conference_sid   Conference id for the hearing currently in progress.
     * @param {string} direction        Direction to mute - e.g. in, out or both
     */
    var muteAllParticipants = function (conference_sid, direction) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/mute_all';

      var data = {
        conference_sid: conference_sid,
        direction: 'in'
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * DELETE /v1/Account/<authid>/Conference/Member/mute_all
     *
     * Unmute all participants in a conference
     *
     * @param {string} conference_sid     Conference id for the hearing currently in progress.
     * @param {string} direction          Direction to mute - e.g. in, out or both
     */
    var unmuteAllParticipants = function (conference_sid, direction) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/mute_all';

      var data = {
        conference_sid: conference_sid,
        direction: 'in'
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

      $http.delete(url, { data: data }).then(
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
     * POST /v1/Account/<authid>/Conference/Member/hold
     *
     * Hold a participant i.e. the participant will be put on a holding bridge and won't be able
     * to hear anything or be heard.
     *
     * Play music on hold on the holding bridge.
     *
     * @param {string} conference_sid     Conference id for the hearing currently in progress.
     * @param {string} participant_sid    Participant id to hold
     */
    var holdParticipant = function (conference_sid, participant_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hold';

      var data = {
        conference_sid: conference_sid,
        participant_sid: participant_sid,
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * DELETE /v1/Account/<authid>/Conference/Member/hold
     *
     * Retrieve a participant from hold.
     * Delete the holding bridge.
     *
     * @param {string} conference_sid         Conference id for the hearing currently in progress.
     * @param {string} participant_sid        Participant id to unhold
     * @param {string} hold_conference_sid    Hold conference sid
     */
    var unholdParticipant = function (conference_sid, participant_sid, hold_conference_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hold';

      var data = {
        conference_sid: conference_sid,
        participant_sid: participant_sid,
        hold_conference_sid: hold_conference_sid
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

      $http.delete(url, { data: data }).then(
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
     * POST /v1/Account/<authid>/Conference/Member/hold_all
     *
     * Hold all participants i.e. the participants will be put on a holding bridge and won't be able to hear anything or be heard.
     * Play music on hold on the holding bridge.
     *
     * @param {string} conference_sid         Conference id for the hearing currently in progress.
     */
    var holdAllParticipants = function (conference_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hold_all';

      var data = {
        conference_sid: conference_sid
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * DELETE /v1/Account/<authid>/Conference/Member/hold_all
     *
     * Retrieve participants from hold.
     * Delete the holding bridge.
     *
     * @param {string} conference_sid         Conference id for the hearing currently in progress.
     * @param {string} hold_conference_sid    Hold conference sid
     */
    var unholdAllParticipants = function (conference_sid, hold_conference_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hold_all';

      var data = {
        conference_sid: conference_sid,
        hold_conference_sid: hold_conference_sid
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
      }

      $http.delete(url, { data: data }).then(
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
     * POST /v1/Account/<authid>/Conference/Member/hangup
     *
     * Hangs up or kicks a participant out of the hearing.
     * Plays a tone when participant hangs up.
     *
     * @param {string} conference_sid         Conference id for the hearing currently in progress.
     * @param {string} participant_sid        Participant id to hang up
     */
    var hangupParticipant = function (conference_sid, participant_sid, phone_number) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hangup';

      var data = {
        conference_sid: conference_sid,
        participant_sid: participant_sid
      }

      console.log('Hangup Participant' + url + ' ' + data);
      
      if (HttpService.testing()) {
        setTimeout(function () {
          data.phone_number = phone_number;

          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * POST /v1/Account/<authid>/Conference/Member/hangup_all
     *
     * Hangs up all participants.
     * Plays a tone when participant hangs up.
     *
     * @param {string} conference_sid       Conference id for the hearing currently in progress.
     */
    var hangupAllParticipants = function (conference_sid) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/Member/hangup_all';

      var data = {
        conference_sid: conference_sid
      }

      if (HttpService.testing()) {
        setTimeout(function () {
          deferred.resolve(data);
        }, 100);

        return deferred.promise;
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
     * GET /v1/Account/<authid>/Conference/<conference id>
     *
     * Get hearing detail.
     *
     * @param {string} conference_id        Conference id for the hearing.
     */
    var getHearingDetail = function (conference_id) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/' + conference_id;

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
     * DELETE /v1/Account/<authid>/Conference/<conference id>
     *
     * End hearing and drop all participants.
     * Plays a tone when participant hangs up.
     *
     * @param {string} conference_id        Conference id for the hearing.
     */
    var endHearing = function (conference_id) {
      var deferred = $q.defer();

      var baseUrl = HttpService.getBaseUrl();

      var authId = 'dars';

      var url = baseUrl + '/v1/Account/' + authId + '/Conference/' + conference_id;

      $http.delete(url).then(
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
    * POST /v1/Account/<authid>/Conference/addNotes
    * Adds Notes to Conference.
    */

   var addNewNotes = function (notesModel) {

    var deferred = $q.defer();
    var baseUrl = HttpService.getBaseUrl();
    var authId = 'dars';

    var url = baseUrl + '/v1/Account/' + authId + '/Conference/addNotes';

    $http.post(url, notesModel).then(
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
    * POST /v1/Account/<authid>/Conference/addDisposition
    * Add or update disposition code to Conference.
    */

   var setDispCode = function (dispCodeModel) {

    var deferred = $q.defer();
    var baseUrl = HttpService.getBaseUrl();
    var authId = 'dars';

    var url = baseUrl + '/v1/Account/' + authId + '/Conference/addDisposition';

    $http.post(url, dispCodeModel).then(
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
    * POST /v1/Account/<authid>/Conference/addRecTag
    * Add or update record tag code to Conference.
    */

   var addNewRecTag = function (recTagModel) {

    var deferred = $q.defer();
    var baseUrl = HttpService.getBaseUrl();
    var authId = 'dars';

    var url = baseUrl + '/v1/Account/' + authId + '/Conference/addRecTag';

    $http.post(url, recTagModel).then(
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

    return {
      ready: ready,
      notReady: notReady,
      startHearing: startHearing,
      addParticipant: addParticipant,
      muteParticipant: muteParticipant,
      unmuteParticipant: unmuteParticipant,
      muteAllParticipants: muteAllParticipants,
      unmuteAllParticipants: unmuteAllParticipants,
      unholdParticipant: unholdParticipant,
      holdParticipant: holdParticipant,
      holdAllParticipants: holdAllParticipants,
      unholdAllParticipants: unholdAllParticipants,
      hangupParticipant: hangupParticipant,
      hangupAllParticipants: hangupAllParticipants,
      getHearingDetail: getHearingDetail,
      endHearing: endHearing,
      dtmf: dtmf,
      setDispCode: setDispCode,
      addNewNotes: addNewNotes,
      addNewRecTag: addNewRecTag
    };
  }
}());
