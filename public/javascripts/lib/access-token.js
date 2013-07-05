/**
 * Module dependencies
 */
var cookie = require("cookie");

module.exports = exports = function() {
  return cookie("_access_token");
};

exports.bearer = function() {
  var accessToken = exports();
  return accessToken ? "Bearer "+accessToken : undefined;
};

exports.auth = function() {
  var bearer = exports.bearer();
  return bearer ? {"authorization":bearer} : {};
};
