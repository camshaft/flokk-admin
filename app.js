/**
 * Module dependencies
 */

var stack = require('simple-stack-common')
  , envs = require('envs')
  , auth = require('./lib/auth')
  , s3 = require('./lib/s3-sign');

/**
 * Defines
 */

var API_URL = envs('API_URL', 'https://api.theflokk.com')
  , IMAGES_BUCKET = envs('IMAGES_BUCKET', 'flokk-item-images')
  , IMAGES_KEY = envs('IMAGES_KEY')
  , IMAGES_SECRET = envs('IMAGES_SECRET')
  , IMAGES_EXPIRES = parseInt(envs('IMAGES_EXPIRES', '300000'));

/**
 * Forwarding headers
 */

var headers = {
  host: 'x-orig-host',
  path: 'x-orig-path',
  port: 'x-orig-port',
  proto: 'x-orig-proto'
};

/**
 * Expose the app
 */

var app = module.exports = stack({
  base: headers
});

/**
 * Extra middleware
 */

app.useBefore('router', stack.middleware.cookieParser());

/**
 * Serve the static assets
 *
 * @todo disable this stuff in prod
 */

app.useBefore('router', '/public', 'public', stack.middleware.static(__dirname+'/build', {maxAge: 3600}));
app.useBefore('router', '/partials', 'partialNotFound', function(req, res) {
  res.sendfile(__dirname+'/public/partials/404.nghtml');
});

/**
 * Use flokk authentication
 */

app.useBefore('router', '/auth/login', 'auth:login', auth);
app.useBefore('router', '/auth/callback', 'auth:callback', auth);
app.useBefore('router', '/auth/logout', 'auth:logout', auth.logout);

/**
 * Proxy the api
 */

app.configure('development', function() {
  var proxy = require('simple-http-proxy');
  app.useBefore('base', '/api', 'api-proxy', proxy(API_URL, {xforward: headers}));
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

/**
 * Routes
 */

app.get('/*', auth.authenticate(), function(req, res, next){
  res.sendfile(__dirname+'/public/index.html');
});
