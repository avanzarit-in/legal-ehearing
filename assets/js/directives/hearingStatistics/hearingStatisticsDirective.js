(function(){
  "use strict";

  var directiveId = "hearingStatistics";

  angular.module('inspinia').directive(directiveId, hearingStatistics);
  /**
   * pageTitle - Directive for set Page title - mata title
   */
  function hearingStatistics($rootScope, $timeout) {
    return {
      scope: {
        statData: '='
      },
      replace: true,
      templateUrl: "js/directives/hearingStatistics/hearingStatistics.html",
      link: function(scope, element, attr) {

        function activate() {

        }

        activate();

      }
    }
  };

}());
