/**
 * Module dependencies
 */

var app = require('.')
  , envs = require('envs')
  , token = require('access-token');

/**
 * Expose the environment to the page
 */

if (window.env) envs.set(window.env);

/**
 * Initialize the client
 */

var client = require('hyperagent');

/**
 * Pass the access token on all of the requests
 */

client.set(token.auth());

/**
 * Initialize the controllers
 */

var IndexController = require('./controllers/index')
  , ItemsController = require('./controllers/items')
  , ItemController = require('./controllers/item')
  , SidenavController = require('./controllers/sidenav');

/**
 * Load the partials
 */

var notFound = require('../partials/404.js')
  , admins = require('../partials/admins.js')
  , categories = require('../partials/categories.js')
  , index = require('../partials/index.js')
  , items = require('../partials/items.js')
  , item = require('../partials/item.js')
  , sidenav = require('../partials/sidenav.js');

/**
 * Initialize the filters used outside of the controllers
 */

var param = require('./filters/param');

/*
 * Configure the app
 */

app.config([
  '$routeProvider',
  '$locationProvider',

  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: index,
        controller: IndexController
      })
      .when('/items', {
        templateUrl: items,
        controller: ItemsController
      })
      .when('/items/:id', {
        templateUrl: item,
        controller: ItemController
      })
      .otherwise({
        templateUrl: notFound,
        controller: IndexController
      });

    $locationProvider.html5Mode(true);
  }
]);
