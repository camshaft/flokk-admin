/**
 * Module dependencies
 */

var app = require('..')
  , client = require('hyperagent');

/**
 * VendorsController
 */

function VendorsController($scope) {
  function onError(err) {
    console.error(err.stack || err.message || err);
  };

  $scope.newVendor = {};

  client()
    .on('error', onError)
    .end(function(res) {

      res
        .follow('vendors')
        .on('error', onError)
        .end(function(res) {
          $scope.$apply(function() {
            $scope.vendors = res.body;
          });
        });
    });
};

/**
 * Register it with angular
 */

app.controller('VendorsController', [
  '$scope',
  VendorsController
]);

/**
 * Let others know where to find it
 */

module.exports = 'VendorsController';
