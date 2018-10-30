'use strict';

function autoFocus($timeout){
  console.log('autofocus');
  return {
    restrict: 'A',
    link : function($scope, $element) {
      
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}

autoFocus.$inject = ['$timeout'];

angular
.module('mortgageCalculator')
.directive('autoFocus', autoFocus);