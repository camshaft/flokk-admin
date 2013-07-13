/**
 * Module dependencies
 */

var superagent = require('superagent')
  , envs = require('envs')
  , accessToken = require('./access-token');

/**
 * Defines
 */

var API_URL = envs('API_URL', '/api');

// TODO come up with a retry strategy
// TODO come up with a reasonable timeout
// TODO should we cache things in localStorage?

module.exports = exports = function() {
  return exports.get(API_URL);
};

exports.get = function() {
  return defaults(superagent.get.apply(superagent, arguments));
};

exports.post = function() {
  return defaults(superagent.post.apply(superagent, arguments));
};

exports.put = function() {
  return defaults(superagent.put.apply(superagent, arguments));
};

exports.del = function() {
  return defaults(superagent.del.apply(superagent, arguments));
};

function defaults(req) {
  req.set(accessToken.auth());

  // Patch the `end` function
  var _end = req.end;
  req.end = function(fn) {
    var self = this;

    _end.call(self, function(res) {
      // If the response was not ok return an error
      if (!res.ok) return self.emit('error', res.body || new Error(res.text));

      // Patch the res to allow following
      // TODO should we emit an error if the rel is not found?
      res.follow = function(rel) {
        var href = typeof res.body[rel] === 'object'
          ? res.body[rel].href
          : res.body[rel];

        return exports.get(href);
      };

      fn(res);
    });
  };

  return req;
};
