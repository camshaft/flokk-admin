/**
 * Module dependencies
 */

var app = require('..');

/**
 * Require the directives
 */

require('../directives/file');

/**
 * IndexController
 */

function IndexController($scope, $location) {

};

/**
 * Register it with angular
 */

app.controller('IndexController', [
  '$scope',
  '$location',
  IndexController
]);

/**
 * Let others know where to find it
 */

module.exports = 'IndexController';
