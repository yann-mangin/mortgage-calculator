'use strict';

function NavigationCtrl($scope, $state, StorageService) {
	var nav = this;

	var setNavigation = function (){
		var deals = StorageService.getDeals();
		
		if (deals){
			if (deals.length > 1) {
				nav.enableManage = true;
				nav.enableCompare = true;
			}else if (deals.length > 0) {
				nav.enableManage = true;
				nav.enableCompare = false;
			}else{
				nav.enableManage = false;
				nav.enableCompare = false;
			}
		}else{
			nav.enableManage = false;
			nav.enableCompare = false;
		}

		if ($state.current.name !== 'compareresult')
			StorageService.deleteComparedDeals();
	};

	setNavigation();

	$scope.$on('update-nav', function() {
		setNavigation();
	});

}

NavigationCtrl.$inject = ['$scope', '$state', 'StorageService'];

angular
.module('mortgageCalculator')
.controller('NavigationCtrl', NavigationCtrl);