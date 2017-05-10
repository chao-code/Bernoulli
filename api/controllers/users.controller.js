const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Review = mongoose.model('Review');

exports.read = function(req, res, next) {
  User.findById(req.params.userid)
    .exec(function(err, author) {
      if (err) {
        res.status(404).send({
          message: 'User does not exist'
        });
      } else {
        Review.find({author: author})
          .sort('-created')
          .exec(function(err, reviews) {
            if (err) {
              res.status(400).send({
                message: `Cannot get ${author.name}'s reviews`
              });
            } else {
              res.status(200).send({
                author: author,
                reviews: reviews
              });
            }
          });
      }
    })
};

exports.signup = function(req, res, next) {
  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({
      message: 'All fields required'
    });
  }

  const user = new User({
    name: name,
    email: email
  });
  user.setPassword(password);
  user.save(function(err) {
    if (err) {
      let message = 'Something went wrong';
      if (err.code == 11000 || err.code == 11001) {
        message = 'Email address is already registered'
      }
      return res.status(400).send({
        message: message
      });
    }
    req.login(user, function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json({
          name: user.name,
          email: user.email,
          id: user.id
        });
      }
    });
  });
};

exports.login = function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'All fields required'
    });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      req.login(user, function(err) {
        res.status(200).send({
          name: user.name,
          email: user.email,
          id: user.id
        });
      });
    }
  })(req, res);
};

exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};

exports.authenticate = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({
      message: 'User is not logged in'
    });
  }
};