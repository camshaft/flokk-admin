/**
 * Module dependencies
 */
var base64decode = require("base64-decode")
  , base64encode = require("base64-encode")
  , pad = require("pad");

exports.encode = function(url) {
  return url
    ? base64encode(url)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
    : '';
};

exports.decode = function(url) {
  return url
    ? base64decode(padString(url)
        .replace(/\-/, '+')
        .replace(/_/, '/'))
    : '';
};

exports.padString;

function padString(string) {
  var mod = string.length % 4;

  // We don't require any padding
  if(!mod) return string;

  // See how much padding we need
  var rem = 4-mod;

  return pad(string, rem, "=");
};
