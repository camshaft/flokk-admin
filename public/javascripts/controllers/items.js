/**
 * Module dependencies
 */

var app = require('..')
  , client = require('../lib/client')
  , each = require('each')
  , Upload = require('s3')
  , Batch = require('batch');

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
        var uid = Math.random() * 1e12 | 0;
        var upload = new Upload(image, {name: uid+image.name});
        upload.end(function(err) {
          if (err) return done(err);
          done(null, upload.req.url.split('?')[0]);
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
