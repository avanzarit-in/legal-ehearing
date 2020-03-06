(function(){

  "use strict";

  var controllerId = "addRecTagModalController";

  angular.module('inspinia').controller(controllerId, ['$uibModalInstance', 'ConferenceService', addRecTagModalController]);

  function addRecTagModalController($uibModalInstance, ConferenceService){
    var vm = this;

    vm.ok = function () {
      console.log(vm.newRecTag);
      $uibModalInstance.close(vm.newRecTag);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

}());
