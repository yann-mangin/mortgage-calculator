'use strict';

function ManageCtrl($state, DealService, StorageService) {
	var vm = this;

	vm.deals = StorageService.getDeals();
	
	if (!vm.deals || vm.deals.length === 0)
		$state.go('home');

	vm.link = function($event, loc, dealId){
    $event.preventDefault();
    $event.stopPropagation();
    $state.go(loc, {dealId: dealId});
	};
	
	vm.deleteDeal = function($event, deletedDeal){
		$event.preventDefault();
		$event.stopPropagation();
  
		var modInstance = DealService.delete(deletedDeal);
    modInstance.result.then(function(response) {
      if (response)
        DealService.deleteInstance(vm, deletedDeal);
    });
	}
}

ManageCtrl.$inject = ['$state', 'DealService', 'StorageService'];

angular
.module('mortgageCalculator')
.controller('ManageCtrl', ManageCtrl);