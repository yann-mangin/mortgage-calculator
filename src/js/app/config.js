'use strict';

/**
 * Mortgage Calculator
 * @param $stateProvider
 * @param $locationProvider
 * @param $urlRouterProvider
 * @param $ocLazyLoadProvider
 * @param ChartJsProvider
 */
function config($stateProvider, $locationProvider, $urlRouterProvider, $ocLazyLoadProvider, ChartJsProvider) {

	ChartJsProvider.setOptions({ colors : ['#00C6CA', '#66dc66', '#ffd015'] });

	$ocLazyLoadProvider.config({
		events: true
	});
  
  $locationProvider.hashPrefix('');
  
	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'views/app/pages/home.html',
		data: { pageTitle: 'Homepage' },
		controller: 'HomeCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js','js/app/controllers/HomeCtrl.js']
					}
				]);
			}]
		}
	})
	.state('new', {
		url: '/new',
		templateUrl: 'views/app/pages/new.html',
		data: { pageTitle: 'New Deal' },
		controller: 'NewCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/directives/autoFocus.js', 'js/app/services/DealService.js','js/app/controllers/DealSaveModalCtrl.js','js/app/controllers/NewCtrl.js']
					}
				]);
			}]
		}
	})
	.state('edit', {
		url: '/edit/:dealId',
		templateUrl: 'views/app/pages/edit.html',
		data: { pageTitle: 'Edit Deal' },
		controller: 'EditCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js', 'js/app/controllers/EditCtrl.js']
					}
				]);
			}]
		}
	})
	.state('result', {
		url: '/result/:dealId',
		templateUrl: 'views/app/pages/result.html',
		data: { pageTitle: 'Deal Result' },
		controller: 'ResultCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/directives/autoFocus.js', 'js/app/services/DealService.js','js/app/controllers/DealSaveModalCtrl.js','js/app/controllers/ResultCtrl.js']
					}
				]);
			}]
		}
	})
	.state('manage', {
		url: '/manage',
		templateUrl: 'views/app/pages/manage.html',
		data: { pageTitle: 'Manage Deals' },
		controller: 'ManageCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js', 'js/app/controllers/DealDeleteModalCtrl.js', 'js/app/controllers/ManageCtrl.js']
					}
				]);
			}]
		}
	})
	.state('compare', {
		url: '/compare',
		templateUrl: 'views/app/pages/compare.html',
		data: { pageTitle: 'Compare Deals' },
		controller: 'CompareCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js', 'js/app/controllers/CompareCtrl.js']
					}
				]);
			}]
		}
	})
	.state('compareresult', {
		url: '/compareresult',
		templateUrl: 'views/app/pages/compare-result.html',
		data: { pageTitle: 'Compare Result Deals' },
		controller: 'CompareResultCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js', 'js/app/controllers/CompareResultCtrl.js']
					}
				]);
			}]
		}
	});

	$urlRouterProvider
    .when('', '/')
    .otherwise('error404');
}

config.$inject = [
  '$stateProvider',
  '$locationProvider',
  '$urlRouterProvider',
  '$ocLazyLoadProvider',
	'ChartJsProvider'
];

angular
.module('mortgageCalculator')
.config(config);