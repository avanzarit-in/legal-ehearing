(function(){
  "use strict";

  var directiveId = "hearingMiniBrief";

  angular.module('inspinia').directive(directiveId, hearingMiniBrief);
  /**
   * pageTitle - Directive for set Page title - mata title
   */
  function hearingMiniBrief($rootScope, $timeout) {
    return {
      scope: {
        brief: '='
      },
      replace: true,
      templateUrl: "js/directives/hearingMiniBrief/hearingMiniBrief.html",
      link: function(scope, element, attr) {

        var icon_colors = ["navy","blue", "lazur", "yellow"];

        scope.isToday = false;
        scope.timezone = "EST";
        scope.meettime = "";

        function getRandomColor(){
          return icon_colors[Math.floor(Math.random()*icon_colors.length)];
        }

        function activate() {
          scope.icon_color = getRandomColor();
          console.log(scope.brief);
        }


        scope.displayMoreInfo = function(){
         
          scope.$emit('displayBriefMainDetail', scope.brief);
        };

        scope.refreshDocket = function(){
         
          scope.$emit('refreshDocket', scope.brief);
        };

        scope.processTime = function(date_string,time_string){
          var momentObj = moment(date_string + ' ' + time_string);

          // console.log(momentObj);

          var newTimeFormat = momentObj.format('hh:mm:ss A'); 
          
          //return momentObj.format('MM.DD.YYYY').toUpperCase();
          return newTimeFormat;
        }

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



          //return momentObj.format('MM.DD.YYYY').toUpperCase();
          return date_string;
        }

        activate();

      }
    }
  };

}());
