(function(){
  "use strict";

  var directiveId = "hearingMainBrief";

  angular.module('inspinia').directive(directiveId, hearingMainBrief);
  /**
   * pageTitle - Directive for set Page title - mata title
   */
  function hearingMainBrief($rootScope, $timeout, ConferenceService) {
    return {
      scope: {
        brief: '='
      },
      replace: true,
      templateUrl: "js/directives/hearingMainBrief/hearingMainBrief.html",
      link: function(scope, element, attr) {

        var icon_colors = ["navy","blue", "lazur", "yellow"];

        scope.isToday = false;
        scope.timezone = "EST";

        scope.claimant = {};

        function getRandomColor(){
          return icon_colors[Math.floor(Math.random()*icon_colors.length)];
        }

        function setClaimantDetails(){
          for(var i = 0; i < scope.brief.participants.length; ++i){
            var participant = scope.brief.participants[i];

            if(participant.partyType_desc === "Appellant"){
              scope.claimant = participant;
            }
          }
        }

        function activate() {
          scope.icon_color = getRandomColor();
          console.log(scope.brief);

          scope.$on('updateMainDetail', function(event, data){
            console.log("Update Main Detail: ");
            console.log(data);
            scope.brief = data;

            setClaimantDetails();
          });

        }

        activate();

        scope.startHearing = function() {
          var hearingModel = new HearingModel();

          ConferenceService.startHearing(hearingModel).then(function(success){
            console.log(success);
            // navigate to the hearing detail view
          }, function(reject){
            console.log(reject); // What to do? Show a toast or flash message.
          });
        };

        scope.processDate = function(date_string){
          var momentObj = moment(date_string);

          // console.log(momentObj);

          var monthDayWhen = momentObj.format('MM.DD');
          var monthDayToday = moment().format('MM.DD');

          // console.log(monthDayWhen);
          // console.log(monthDayToday);

          if(monthDayToday === monthDayWhen){
            scope.isToday = true;
          }



          return date_string;
        }

        scope.processTime = function(date_string,time_string){
          var momentObj = moment(date_string + ' ' + time_string);

          // console.log(momentObj);

          var newTimeFormat = momentObj.format('hh:mm:ss A'); 
          
          //return momentObj.format('MM.DD.YYYY').toUpperCase();
          return newTimeFormat;
        }

      }
    }
  };

}());
