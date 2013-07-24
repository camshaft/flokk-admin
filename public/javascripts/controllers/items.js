/**
 * Module dependencies
 */

var app = require('..')
  , client = require('hyperagent')
  , md5 = require('hash-file')
  , envs = require('envs')
  , each = require('each')
  , Upload = require('s3')
  , Batch = require('batch');

/**
 * Defines
 */

var ONE_YEAR = 31536000
  , BROWSER_ENV = envs('BROWSER_ENV', 'production')
  , CLOUDFRONT_URL = envs('CLOUDFRONT_URL', '//d30wvy161n1c3v.cloudfront.net');

/**
 * ItemsController
 */

function ItemsController($scope) {
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

  $scope.createItem = function(ngform, values, form) {
    // TODO verify the form

    var batch = new Batch;

    each(values.images, function(image) {
      batch.push(function(done) {
        md5(image, function(err, hash) {
          if (err) return done(err);

          // Create a name based on the environment and hash
          var name = [BROWSER_ENV,hash,image.name].join('-');

          // Upload it to s3
          var upload = new Upload(image, {name: name});

          upload.set('cache-control', 'public, max-age='+ONE_YEAR);

          upload.end(function(err) {
            if (err) return done(err);
            done(null, [CLOUDFRONT_URL,name].join('/'));
          });
        });
      });
    });

    batch.end(function(err, images) {
      // TODO handle error
      values.images = images;

      // TODO pull the method from the form
      client
        .post(form.action)
        .send(values)
        .on('error', onError)
        .end(function(res) {
          console.log(res);
        });
    });
  };
};

/**
 * Register it with angular
 */

app.controller('ItemsController', [
  '$scope',
  ItemsController
]);

/**
 * Let others know where to find it
 */

module.exports = 'ItemsController';
