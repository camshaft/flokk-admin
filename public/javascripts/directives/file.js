/**
 * Module dependencies
 */

var app = require("..");

/**
 * input
 */

function input($parse) {
  return {
    restrict: 'E',
    require: '?handle',
    link: function($scope, elem, attrs) {
      if (!attrs.type || attrs.type.toLowerCase() !== 'file') {
        return;
      }

      var setModel;

      $scope.$watch(function() {
        return attrs.handle;
      }, function(val) {
        setModel = $parse(val).assign;
      });

      elem.bind('change', function(e) {
        if (!e.target.files || !e.target.files.length || !e.target.files[0] || !setModel) {
          return true;
        }
        var fileData = attrs.multiple ? e.target.files : e.target.files[0];

        setModel($scope, fileData);
      });
    }
  }
};

/**
 * Register it with angular
 */

app.directive("input", [
  '$parse',
  input
]);

/**
 * Let others know where to find it
 */

module.exports = "input";
