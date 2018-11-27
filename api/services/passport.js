const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const UserController = require('../controllers/UserController')
const responseStatus = require('../../configs/responseStatus')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const constants = require('../../configs/constants')

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (email, password, cb) {
  let user = await UserController.getUserByEmail(email)
  if (!user) return cb(null, false)
  const resolve = await bcrypt.compare(password, user.password) // check password
  if (!resolve) return cb(null, false)
  user = JSON.parse(JSON.stringify(user))
  delete user.password
  return cb(null, user)
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL
},
async function (accessToken, refreshToken, profile, done) {
  const obj = {
    name: profile.displayName,
    email: profile.emails[0].value,
    avatar: profile.photos[0].value,
    provider: constants.PROVIDERS.GOOGLE
  }
  const user = await UserController.findOrCreateSocialUser(obj)
  return done(null, user)
}))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user._id)
})

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})
