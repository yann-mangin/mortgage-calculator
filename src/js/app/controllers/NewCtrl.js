'use strict';

function NewCtrl($state, StorageService, DEAL_CONFIG) {
	var vm = this;

	vm.deal = StorageService.getItem(DEAL_CONFIG.lsNewDealName);
	
	if (!vm.deal)
    vm.deal = DEAL_CONFIG.newDeal;
	
	vm.calculate = function(){
		StorageService.setItem(DEAL_CONFIG.lsNewDealName, vm.deal);
    $state.go('result',{dealId: vm.deal.id});
	};
}

NewCtrl.$inject = ['$state', 'StorageService', 'DEAL_CONFIG'];

angular
.module('mortgageCalculator')
.controller('NewCtrl', NewCtrl);