/**
 * Module dependencies
 */

var app = require('..')
  , client = require('hyperagent');

/**
 * CategoriesController
 */

function CategoriesController($scope) {
  function onError(err) {
    console.error(err.stack || err.message || err);
  };

  $scope.newCategory = {};

  client()
    .on('error', onError)
    .end(function(res) {

      res
        .follow('categories')
        .on('error', onError)
        .end(function(res) {
          $scope.$apply(function() {
            $scope.categories = res.body;
          });
        });
    });
};

/**
 * Register it with angular
 */

app.controller('CategoriesController', [
  '$scope',
  CategoriesController
]);

/**
 * Let others know where to find it
 */

module.exports = 'CategoriesController';
