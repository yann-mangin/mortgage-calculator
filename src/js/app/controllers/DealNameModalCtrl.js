function DealNameModalCtrl($uibModalInstance) {
  var modal = this;

  modal.save = function () {
    $uibModalInstance.close({dealName: modal.dealName});
  };

  modal.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

DealNameModalCtrl.$inject = ['$uibModalInstance'];

angular.module('mortgageCalculator')
.controller('DealNameModalCtrl', DealNameModalCtrl);