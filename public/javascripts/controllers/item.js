/**
 * Module dependencies
 */

var app = require('..')
  , client = require('../lib/client');

/**
 * ItemController
 */

function ItemController($scope) {
  function onError(err) {
    console.error(err.stack || err.message || err);
  };

  client()
    .on('error', onError)
    .end(function(res) {

      res
        .follow('items')
        .on('error', onError)
        .end(function(res) {
          $scope.$apply(function() {
            $scope.itemList = res.body;
          });
        });
    });
};

/**
 * Register it with angular
 */

app.controller('ItemController', [
  '$scope',
  ItemController
]);

/**
 * Let others know where to find it
 */

module.exports = 'ItemController';
