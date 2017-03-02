const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('./config');

const app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'wandomstwing'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));

passport.use(new Auth0Strategy({
   domain:       config.domain,
   clientID:     config.clientID,
   clientSecret: config.clientSecret,
   callbackURL:  'http://localhost:9090/auth/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    res.status(200).send(req.user);
});

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
});

app.listen(9090, function() {
  console.log('Connected on 9090')
});