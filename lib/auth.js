/**
 * Module dependencies
 */
var passport = require("passport")
  , envs = require("envs")
  , FlokkStrategy = require("passport-flokk").Strategy;

/**
 * Defines
 */
var FLOKK_CLIENT_ID = envs("FLOKK_CLIENT_ID")
  , FLOKK_CLIENT_SECRET = envs("FLOKK_CLIENT_SECRET")
  , AUTH_URL = envs("AUTH_URL");

/**
 * Setup passport
 */
passport.use(new FlokkStrategy({
    clientID: FLOKK_CLIENT_ID,
    clientSecret: FLOKK_CLIENT_SECRET,
    host: AUTH_URL,
    skipUserProfile: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile = profile || {};
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    done(null, profile);
  }
));

function login(req, res, next) {
  // If they're already signed in, don't do anything
  if (req.cookies._access_token) return next();
  if (req.user && req.user.provider === "flokk") return next();

  // Setup the options for passport
  var options = {
    callbackURL: req.base + "/auth/callback",
    state: (req.get('referrer') || '/')
  };

  // Profile the call
  var done = req.metric.profile("flokk-login");

  return passport.authenticate("flokk", options, function(err, profile) {
    // End profiling
    done();

    // We've got an error
    if (err) return next(err);

    // TODO handle oauth errors - like access denied
    if (!profile.accessToken) return res.redirect(req.query.state);

    // Expose the profile
    req.user = profile;

    // Expose the access token
    res.cookie("_access_token", profile.accessToken, {
      secure: ~req.base.indexOf("https://")
    });

    res.redirect(req.query.state);
  })(req, res, next);
};

function logout(req, res, next) {
  // Clear the access token
  res.clearCookie("_access_token", {
    secure: ~req.base.indexOf("https://")
  });

  res.redirect(AUTH_URL+'/logout');
};

function authenticate() {
  return login;
};

module.exports = login;
module.exports.logout = logout;
module.exports.authenticate = authenticate;
