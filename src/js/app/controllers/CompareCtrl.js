'use strict';

function CompareCtrl($state, $scope, StorageService) {
	var vm = this;

	vm.deals = StorageService.getDeals();
	
	if (!vm.deals || vm.deals.length === 0)
		$state.go('home');

	vm.selectComparision = function(comparedDeal){
		comparedDeal.selected = (comparedDeal.selected === null) ? comparedDeal.selected : !comparedDeal.selected;
	};

	vm.compare = function(){
		var comparedDeals = vm.deals.filter(function(deal){
			return deal.selected;
		});
		StorageService.setComparedDeals(comparedDeals);
		$state.go('compareresult');

	};

	$scope.$watch('vm.deals', function(newValue) {
		console.log('newValue',newValue);
		vm.selectedCount = newValue.filter(function(deal){
			return deal.selected;
		}).length;
	},true);
}

CompareCtrl.$inject = ['$state', '$scope', 'StorageService'];

angular
.module('mortgageCalculator')
.controller('CompareCtrl', CompareCtrl);