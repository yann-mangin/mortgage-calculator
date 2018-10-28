'use strict';

function elementReady($timeout, $rootScope) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      $timeout(function timeout() {
        element.ready(function onElementReady() {
          scope.$apply(function apply() {
            $rootScope.$broadcast(attrs.elementReady + ':ready');
          });
        });
      });
    }
  };
}

elementReady.$inject = ['$timeout', '$rootScope'];

angular
  .module('anatwine')
  .directive('elementReady', elementReady)
;
