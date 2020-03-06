(function(){
  "use strict";

  var directiveId = "participantCard";

  angular.module('inspinia').directive(directiveId, participantCard);
  /**
   * pageTitle - Directive for set Page title - mata title
   */
  function participantCard($rootScope, $timeout, ConferenceService) {
    return {
      scope: {
        object: '=',
        muteManual: '=',
        holdManual: '=',
        hangupManual: '=',
        hearingStarted: '=',
        connected: '=',
        extensionManual: '=',
        removeManual: '=',
        ringing: '=',
        talking: '='
      },
      replace: true,
      templateUrl: "js/directives/participantCard/participantCard.html",
      link: function(scope, element, attr) {

        scope.muteActive = false;
        scope.holdActive = false;

        scope.muteClassActive = false;
        scope.holdClassActive = false;
        scope.connectedClassActive = false;

        scope.connected = false;
        scope.participantStatus = 'Disconnected';
        scope.labelClass = '';
        scope.dtmf = '';

        // scope.muteManual = scope.muteManual || false;
        // scope.holdManual = scope.holdManual || false;
        // scope.hangupManual = scope.hangupManual || false;

        function activate() {
          console.log(scope.object);

          scope.muteActive = false;
          scope.holdClassActive = false;
          scope.connectedClassActive = false;
        }

        activate();

        scope.keypadModal = function(){
         
          scope.$emit('dialDigits', scope.object);

        };

        scope.reset = function(){

          scope.object.dtmf='';

        };

        scope.remove = function () {

          console.log(scope.object);

          scope.$emit('remove', scope.object);

        };

        scope.dtmf = function () {

          if (!scope.hearingStarted) {
            return;
          }

          console.log(scope.object);

          scope.$emit('dtmf', scope.object);

        };

        scope.mute = function(){

          if(!scope.hearingStarted){
            return;
          }

          console.log(scope.object);

          scope.$emit('mute', scope.object);
        };

        scope.hold = function(){

          if(!scope.hearingStarted){
            return;
          }

          scope.$emit('hold', scope.object);
        };

        scope.hangup = function(){
          scope.$emit('hangup', scope.object);
        };

        scope.$on('hold_all', function() {


          if(scope.object.connected){
            scope.object.hold = true;

            scope.holdActive = true;

            // scope.muteActive = false;
          }
        });

        scope.$on('mute_all', function() {

          if(scope.object.connected){
            scope.object.mute = true;

            // scope.holdActive = false;
            scope.muteActive = true;


          }
        });

        scope.$on('unmute_all', function() {


          if(scope.object.connected){
            scope.object.mute = false;

            // scope.holdActive = false;
            scope.muteActive = false;

          }
        });

        scope.$on('unhold_all', function() {


          if(scope.object.connected){
            scope.object.hold = false;

            scope.holdActive = false;

          }
        });

        scope.addToHearing = function(dial_phone){

          console.log('Participant Card Directive: addToHearing - ' + dial_phone);

          if(!scope.hearingStarted){
            return;
          }

          scope.object.phone_number=dial_phone;
          
          scope.$emit('addedParticipant', scope.object);
        };


        scope.$watch('connected', function(oldVal, newVal){
          console.log('Connected changed.');
          console.log(newVal);

          if(newVal){

          }
          else{

          }
        });

        // ng-class="{'label-info': muteClassActive, 'label-warning': holdClassActive, 'label-primary': connectedClassActive}"

        scope.$watch('object.mute', function(oldVal, newVal){
          if(scope.object.mute){
            scope.participantStatus = "Muted";

            scope.muteClassActive = true;
            scope.holdClassActive = false;
            scope.connectedClassActive = false;

            scope.labelClass = 'label-info';
          }
          else{
            scope.participantStatus = "Connected";

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-primary';
          }
        });

        scope.$watch('object.hold', function(oldVal, newVal){
          if(scope.object.hold){
            scope.participantStatus = "On Hold";

            scope.muteClassActive = false;
            scope.holdClassActive = true;
            scope.connectedClassActive = false;

            scope.labelClass = 'label-warning';
          }
          else{
            scope.participantStatus = "Connected";

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-primary';
          }
        });

        scope.$watch('object.connected', function(oldVal, newVal){

          console.log(scope.object);

          if(scope.object.connected){
            scope.participantStatus = 'Connected';

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-primary';
          }
          else{
            scope.participantStatus = "Disconnected";

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = false;

            scope.labelClass = '';
          }
        });

        scope.$watch('object.ringing', function(oldVal, newVal){

          if(scope.object.ringing){
            scope.participantStatus = 'Ringing';

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-danger';
          }
          else{
            scope.participantStatus = "Disconnected";

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = false;

            scope.labelClass = '';
          }
        });

        scope.$watch('object.talking', function(oldVal, newVal){


          if(scope.object.talking){
            scope.participantStatus = 'Talking';

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-danger';
          }
          else if(scope.object.connected){
            scope.participantStatus = 'Connected';
            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = true;

            scope.labelClass = 'label-primary';
          }
          else {
            scope.participantStatus = "Disconnected";

            scope.muteClassActive = false;
            scope.holdClassActive = false;
            scope.connectedClassActive = false;

            scope.labelClass = '';
          }
        });
      }
    }
  };

}());
