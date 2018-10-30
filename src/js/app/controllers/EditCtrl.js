'use strict';

function EditCtrl($stateParams, $state, StorageService) {
	var vm = this;
  var dealId = parseInt($stateParams.dealId);
  
  vm.deal = StorageService.getDeal(dealId);
	
	vm.calculate = function(){
    $state.go('result',{dealId: vm.deal.id});
	};
}

EditCtrl.$inject = ['$stateParams', '$state', 'StorageService'];

angular
.module('mortgageCalculator')
.controller('EditCtrl', EditCtrl);