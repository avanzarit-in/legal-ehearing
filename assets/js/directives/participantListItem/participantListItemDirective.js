(function(){
  "use strict";

  var directiveId = "participantListItem";

  angular.module('inspinia').directive(directiveId, participantListItem);
  /**
   * pageTitle - Directive for set Page title - mata title
   */
  function participantListItem($rootScope, $timeout, ConferenceService) {
    return {
      scope: {
        participantData: '=',
        conferenceSid: '=',
        docketNumber: '=',
        hearingStarted: '='
      },
      replace: true,
      templateUrl: "js/directives/participantListItem/participantListItem.html",
      link: function(scope, element, attr) {

        function activate() {
          console.log(scope.participantData);
        }

        activate();

        scope.addToHearing = function(){

          scope.$emit('addedParticipant', scope.participantData);
        };

      }
    }
  };

}());
