'use strict';

function errorHandler($filter, notify) {
  
  var factory = {};
  
  factory.handleError = function handleError() {
    notify({
      message: $filter('translate')('generic.error.message'),
      startTop: 100,
      classes: 'alert-danger',
      position: 'center',
      templateUrl: 'views/common/notify.html'
    });
  };
  
  return factory;
}

errorHandler.$inject = [
  '$filter',
  'notify'
];

angular
  .module('anatwine')
  .factory('ErrorHandler', errorHandler)
;
