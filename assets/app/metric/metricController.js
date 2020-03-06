(function(){
  'use strict';

  var controllerId = "metricController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$location', 'UserService', metricController]);

  function metricController($rootScope, $location, UserService){
	vm.loginError = false;
	vm.errorMsg = '';

    function activate(){
      console.log("Activate Login Controller");
    };


    activate();
  };

}());
