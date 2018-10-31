'use strict';

function NewCtrl($state, DealService, StorageService, DEAL_CONFIG) {
	var vm = this;
 
	vm.setFormGroupData = DealService.setFormGroupData;
	vm.htmlValidationRegex = DEAL_CONFIG.htmlValidationRegex;
	
	vm.deal = StorageService.getItem(DEAL_CONFIG.lsNewDealName);
	
	console.log('DEAL_CONFIG.newDeal',DEAL_CONFIG.newDeal);
	if (!vm.deal)
    vm.deal = DEAL_CONFIG.newDeal;
	console.log('vm.deal',vm.deal);
	
	vm.calculate = function(){
		StorageService.setItem(DEAL_CONFIG.lsNewDealName, vm.deal);
    $state.go('result',{dealId: vm.deal.id});
	};
}

NewCtrl.$inject = ['$state', 'DealService', 'StorageService', 'DEAL_CONFIG'];

angular
.module('mortgageCalculator')
.controller('NewCtrl', NewCtrl);