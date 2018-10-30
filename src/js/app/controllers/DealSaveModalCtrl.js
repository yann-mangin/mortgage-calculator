'use strict';

function DealSaveModalCtrl($uibModalInstance) {
  var modal = this;
  
  modal.save = function () {
    $uibModalInstance.close({dealName: modal.dealName});
  };

  modal.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

DealSaveModalCtrl.$inject = ['$uibModalInstance'];

angular.module('mortgageCalculator')
.controller('DealSaveModalCtrl', DealSaveModalCtrl);