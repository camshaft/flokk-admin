/**
 * Module dependencies
 */

var crypto = require('crypto');

module.exports = sign;

function sign(options) {
  var expires = (Date.now() + options.expires) / 1000 | 0;

  var str = options.method.toUpperCase()
    + '\n\n' + options.mime
    + '\n' + expires
    + '\nx-amz-acl:public-read'
    + '\n/' + options.bucket
    + '/' + options.name;

  var sig = crypto
    .createHmac('sha1', options.secret)
    .update(str)
    .digest('base64');

  sig = encodeURIComponent(sig);

  return 'https://' + options.bucket
    + '.s3.amazonaws.com/'
    + options.name
    + '?Expires=' + expires
    + '&AWSAccessKeyId=' + options.key
    + '&Signature=' + sig;
}
