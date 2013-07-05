/**
 * Module dependencies
 */
var app = require("..")
  , _param = require("../lib/url-param");

/**
 * param
 */
function param() {
  return function(url) {
    if(!url) return;
    return _param.encode(url);
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
