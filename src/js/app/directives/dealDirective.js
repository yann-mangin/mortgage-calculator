function dealListItems() {
  return {
    restrict: "E",
    scope: {
      deals: '=deals'
    },
    template:"<ng-include src=\"'views/app/templates/deal-list-items.html'\"></ng-include>",
    controller: ['$scope', '$attrs', '$element', function($scope, $attrs, $element) {

      $scope.deleteDeal = function(event, dealId){
        console.log('$element',$element);
      };
      
    }]
  }
}
dealListItems.$inject = [];

angular
.module('mortgageCalculator')
.directive('dealListItems', dealListItems);