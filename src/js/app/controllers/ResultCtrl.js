'use strict';

function ResultCtrl($stateParams, $state, DealService, StorageService) {
	var vm = this;
	var dealId = parseInt($stateParams.dealId);

	if (dealId === 0){
		vm.deal = StorageService.getItem('newDeal');
  
		if (!vm.deal)
			$state.go('new');
	}else{
    vm.deal = StorageService.getDeal(dealId);
	}
  
  vm.dealRes = DealService.calculate(vm.deal);

	vm.save = function(){
		DealService.save(vm.deal);
	};
	
	vm.edit = function(){
		if (vm.deal.id === 0) {
			$state.go('new');
		} else {
			$state.go('edit', {dealId: vm.deal.id});
		}
	}
}

ResultCtrl.$inject = ['$stateParams', '$state', 'DealService', 'StorageService'];

angular
.module('mortgageCalculator')
.controller('ResultCtrl', ResultCtrl);