(function(){
  'use strict';

  var controllerId = "metricsController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$location', 'UserService', metricsController]);

  function metricsController($rootScope, $location, UserService){
    var vm = this;
	vm.loginError = false;
	vm.errorMsg = '';

    function activate(){
      console.log("Activate Login Controller");
    };

    vm.doLogin = function(){
      var username = vm.username;
      var password = vm.password;
      var phone = vm.phone;

      UserService.login(username, password, phone).then(
        function(success) {
          $location.path("/dashboard");
        },
        function (error){
			vm.loginError = true;
			vm.errorMsg = 'Authentication failed: username and/or password is incorrect';
        }
      );
    };


    activate();
  };

}());
