(function(){

  "use strict";

  var controllerId = "docketSearchModalController";

  angular.module('inspinia').controller(controllerId, ['$uibModalInstance', 'ConferenceService', docketSearchModalController]);

  function docketSearchModalController($uibModalInstance, ConferenceService){
    var vm = this;

    vm.docketFound = false;
    vm.docketData={};

    vm.search = function(docket_number){
      console.log('Perform Search.');

      var docketNumber = docket_number.split("-");
      var issueNum = docketNumber[0];
      var issueSeqNum = docketNumber[1];

      var strDocketNumber = issueNum + '-'+ parseInt(issueSeqNum,10);

      console.log(' Docket Number - Search : ' + strDocketNumber);
      
      ConferenceService.searchDockets(strDocketNumber).then(
        function(success){
          if(success){
            vm.docketFound = true;
            vm.docketData = success[0];
          }
          else{
            vm.docketFound = false;
          }

        },
        function(error){
          console.log(error);
        }
      )
    }

    vm.ok = function () {
      $uibModalInstance.close(vm.docketData);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

}());
