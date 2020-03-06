(function(){
  'use strict';

  var controllerId = "loginController";

  angular.module('inspinia').controller(controllerId, ['$rootScope', '$location', 'UserService', loginController]);

  function loginController($rootScope, $location, UserService){
    var vm = this;
	  vm.loginError = false;
	  vm.errorMsg = '';

    function activate(){
      console.log("Activate Login Controller");

      //vm.setupSockets();

    };


    vm.doLogin = function(){
      var username = vm.username;
      var password = vm.password;
      var phone = vm.phone;

      UserService.login(username, password, phone).then(
        function(success) {
          
          console.log(username);
          $location.path("/dashboard");
          
        },
        function (error){
			    console.log(error.data);
			    vm.loginError = true;
			    vm.errorMsg = error.data.statusMessage;
        }
      );
    };

    activate();

  };

}());
