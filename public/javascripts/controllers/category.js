/**
 * Module dependencies
 */

var app = require('..')
  , client = require('hyperagent');

/**
 * CategoryController
 */

function CategoryController($scope) {
  $scope.modifiedCategory = {};

  $scope.$watch('categoryLink', function(link) {
    if(link) fetch(link.href, $scope);
  });
};

function fetch (href, $scope) {
  function onError(err) {
    // TODO show a graceful error to the user
    console.error(err.stack || err.message || err);
  };

  client
    .get(href)
    .on('error', onError)
    .end(function(res) {
      // Display it to the view
      $scope.$apply(function() {
        $scope.category = res.body;
      });
    });
}

/**
 * Register it with angular
 */

app.controller('CategoryController', [
  '$scope',
  CategoryController
]);

/**
 * Let others know where to find it
 */

module.exports = 'CategoryController';
