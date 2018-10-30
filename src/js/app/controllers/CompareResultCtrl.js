'use strict';

function CompareResultCtrl($state, StorageService, DealService) {
	var vm = this;

	vm.deals = StorageService.getComparedDeals();

	if (!vm.deals || vm.deals.length === 0)
		$state.go('home');

	vm.dealRes = [];

	for (var key in vm.deals){
		var deal = vm.deals[key];

		vm.dealRes[key] = DealService.calculate(deal);
	}
}

CompareResultCtrl.$inject = ['$state', 'StorageService', 'DealService'];

angular
.module('mortgageCalculator')
.controller('CompareResultCtrl', CompareResultCtrl);