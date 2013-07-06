/**
 * Module dependencies
 */
var app = require("..")
  , websafe = require("websafe-base64");

/**
 * param
 */
function param() {
  return function(url) {
    if(!url) return;
    return websafe.encode(url);
  };
};

/**
 * Register it with angular
 */
app.filter("param", [
  param
]);

/**
 * Let others know where to find it
 */
module.exports = "param";
