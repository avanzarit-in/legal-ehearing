(function(){

  "use strict";

  var controllerId = "addParticipantModalController";

  angular.module('inspinia').controller(controllerId, ['$uibModalInstance', 'ConferenceService', addParticipantModalController]);

  function addParticipantModalController($uibModalInstance, ConferenceService){
    var vm = this;

    vm.ok = function () {
      console.log(vm.newParticipant);
      $uibModalInstance.close(vm.newParticipant);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.processDate = function(date_string){
      var momentObj = moment(date_string);

      // console.log(momentObj);

      var monthDayWhen = momentObj.format('MM.DD');
      var monthDayToday = moment().format('MM.DD');

      return date_string;
    }

    vm.processTime = function(date_string,time_string){
      var momentObj = moment(date_string + ' ' + time_string);

      // console.log(momentObj);

      var newTimeFormat = momentObj.format('hh:mm:ss A'); 
      
      //return momentObj.format('MM.DD.YYYY').toUpperCase();
      return newTimeFormat;
    }

  };

}());
