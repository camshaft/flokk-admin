/**
 * Module dependencies
 */

var app = require('..')
  , param = require('websafe-base64')
  , client = require('hyperagent');

/**
 * Load the partials
 */

require('../../partials/sidenav');

/**
 * SidenavController
 */

function SidenavController($scope, $routeParams) {
  // TODO watch the route and hightlight the current

  function onError(err) {
    console.error(err.stack || err.message || err);
  };

  client()
    .on('error', onError)
    .end(function(res) {

      // Expose the root
      $scope.$apply(function() {
        $scope.root = res.body;
      });
    });
};

/**
 * Register it with angular
 */

app.controller('SidenavController', [
  '$scope',
  '$routeParams',
  SidenavController
]);

/**
 * Let others know where to find it
 */

module.exports = 'SidenavController';
