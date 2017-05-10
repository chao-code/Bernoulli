const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, '-hash -salt', done);
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({email: email.toLowerCase()}, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'Incorrect Email Address'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect Password'
        });
      }
      return done(null, user);
    });
  }
));