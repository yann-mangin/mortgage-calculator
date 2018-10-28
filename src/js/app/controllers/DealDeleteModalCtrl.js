function DealDeleteModalCtrl($uibModalInstance, deal) {
  var modal = this;
  
  modal.deal = deal;
  
  modal.delete = function () {
    $uibModalInstance.close(true);
  };

  modal.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

DealDeleteModalCtrl.$inject = ['$uibModalInstance', 'deal'];

angular.module('mortgageCalculator')
.controller('DealDeleteModalCtrl', DealDeleteModalCtrl);