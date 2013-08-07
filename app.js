/**
 * Module dependencies
 */

var stack = require('flokk-angular')
  , envs = require('envs')
  , s3 = require('./lib/s3-sign');

/**
 * Defines
 */

var IMAGES_BUCKET = envs('IMAGES_BUCKET', 'flokk-item-images')
  , IMAGES_KEY = envs('IMAGES_KEY')
  , IMAGES_SECRET = envs('IMAGES_SECRET')
  , IMAGES_EXPIRES = parseInt(envs('IMAGES_EXPIRES', '300000'));

/**
 * Expose the app
 */

var app = module.exports = stack({
  restricted: true
});

/**
 * Configure the app
 */

app.locals({
  ngapp: envs('APP_NAME', 'flokk-admin'),
  title: envs('INDEX_TITLE', 'Admin'),
  description: envs('SITE_DESCRIPTION', ''),
  env: {
    BROWSER_ENV: envs('NODE_ENV'),
    API_URL: envs('API_URL'),
    CLOUDFRONT_URL: envs('CLOUDFRONT_URL')
  }
});

// TODO pull these from the cdn

app.locals({
  styles: [
    '/public/build.css'
  ]
});

app.locals({
  scripts: [
    '/public/build.js'
  ]
});

/**
 * Sign upload requests
 */

app.get('/sign', function(req, res, next) {
  // TODO restrict to calls from our domain
  var config = {
    bucket: IMAGES_BUCKET,
    key: IMAGES_KEY,
    secret: IMAGES_SECRET,
    expires: IMAGES_EXPIRES,
    mime: req.query.mime,
    name: req.query.name,
    method: 'PUT'
  };

  res.send(s3(config));
});
