'use strict';

function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ChartJsProvider) {

	ChartJsProvider.setOptions({ colors : ['#00C6CA', '#66dc66', '#ffd015'] });

	$ocLazyLoadProvider.config({
		events: true
	});

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'views/app/home.html',
		data: { pageTitle: 'Homepage' },
		controller: 'HomeCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js','js/app/HomeCtrl.js']
					}
				]);
			}]
		}
	})
	.state('new', {
		url: '/new',
		templateUrl: 'views/app/new.html',
		data: { pageTitle: 'New Deal' },
		controller: 'NewCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js','js/app/DealNameModalCtrl.js','js/app/NewCtrl.js']
					}
				]);
			}]
		}
	})
	.state('edit', {
		url: '/edit/:dealId',
		templateUrl: 'views/app/edit.html',
		data: { pageTitle: 'Edit Deal' },
		controller: 'EditCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js', 'js/app/EditCtrl.js']
					}
				]);
			}]
		}
	})
	.state('result', {
		url: '/result/:dealId',
		templateUrl: 'views/app/result.html',
		data: { pageTitle: 'Deal Result' },
		controller: 'ResultCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/services/DealService.js','js/app/DealNameModalCtrl.js','js/app/ResultCtrl.js']
					}
				]);
			}]
		}
	})
	.state('manage', {
		url: '/manage',
		templateUrl: 'views/app/manage.html',
		data: { pageTitle: 'Manage Deals' },
		controller: 'ManageCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/dealsDirectives.js', 'js/app/services/DealService.js', 'js/app/DealDeleteModalCtrl.js', 'js/app/ManageCtrl.js']
					}
				]);
			}]
		}
	})
	.state('compare', {
		url: '/compare',
		templateUrl: 'views/app/compare.html',
		data: { pageTitle: 'Compare Deals' },
		controller: 'CompareCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/dealsDirectives.js', 'js/app/services/DealService.js', 'js/app/CompareCtrl.js']
					}
				]);
			}]
		}
	})
	.state('compareresult', {
		url: '/compareresult',
		templateUrl: 'views/app/compare-result.html',
		data: { pageTitle: 'Compare Result Deals' },
		controller: 'CompareResultCtrl',
		controllerAs: 'vm',
		resolve: {
			deps: ['$ocLazyLoad', function ocLazyLoad($ocLazyLoad) {
				return $ocLazyLoad.load([
					{
						files: ['js/app/dealsDirectives.js', 'js/app/services/DealService.js', 'js/app/CompareResultCtrl.js']
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
  '$urlRouterProvider',
  '$ocLazyLoadProvider',
	'ChartJsProvider'
];

angular
.module('mortgageCalculator')
.config(config);