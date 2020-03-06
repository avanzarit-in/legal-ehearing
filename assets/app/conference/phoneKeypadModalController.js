(function(){

  "use strict";

  var controllerId = "phoneKeypadModalController";

  angular.module('inspinia').controller(controllerId, ['$uibModalInstance', 'ConferenceService', phoneKeypadModalController]);

  function phoneKeypadModalController($uibModalInstance, ConferenceService){
    var vm = this;

    vm.phoneInput = {
      digits: ''
    };

    vm.ok = function () {
      
      $uibModalInstance.close(vm.phoneInput);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  };

}());
