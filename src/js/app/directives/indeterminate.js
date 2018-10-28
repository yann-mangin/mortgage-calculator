/**
* ANATWINE PORTAL v2
*
*/

/**
* indeterminate - directive
*/

angular
.module('mortgageCalculator').directive('indeterminate', function() {
  return {
    scope: true,
    require: '?ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var childList = attrs.list;
      var property = attrs.property;
      var selectable = attrs.selectable;

      // Bind the onChange event to update children
      element.bind('change', function() {
        scope.$apply(function () {
          var isChecked = element.prop('checked');

          // Set each child's selected property to the checkbox's checked property
          angular.forEach(scope.$eval(childList), function(child) {
            if (selectable && child[selectable])
              child[property] = isChecked;
          });
        });
      });

      // Watch the children for changes
      scope.$watch(childList, function(newValue) {
        var hasChecked = false;
        var hasUnchecked = false;

        // Loop through the children
        angular.forEach(newValue, function(child) {
          if (child[property]) {
            hasChecked = true;
          } else {
            if (selectable && child[selectable])
              hasUnchecked = true;
          }
        });

        // Determine which state to put the checkbox in
        if (hasChecked && hasUnchecked) {
          element.prop('checked', false);
          element.prop('indeterminate', true);
          if (modelCtrl) {
            modelCtrl.$setViewValue(false);
          }
        } else {
          element.prop('checked', hasChecked);
          element.prop('indeterminate', false);
          if (modelCtrl) {
            modelCtrl.$setViewValue(hasChecked);
          }
        }
      }, true);
    }
  };
});