const Review = require('mongoose').model('Review');

exports.reviewByID = function(req, res, next, id) {
  Review.findById(id)
    .populate('author', 'name email')
    .exec(function(err, review) {
      if (err) {
        next(err);
      } else if (!review) {
        const error = new Error('Cannot load review: ' + id);
        error.status = 404;
        next(error);
      } else {
        req.review = review;
        next();
      }
    });
};

exports.list = function(req, res, next) {
  Review.find()
    .sort('-created')
    .populate('author', 'name email')
    .exec(function(err, reviews) {
      if (err) {
        res.status(400).send({
          message: 'Cannot get reviews'
        });
      } else {
        res.status(200).send(reviews);
      }
    });
};

exports.create = function(req, res, next) {
  const review = new Review(req.body);
  review.author = req.user;
  review.save(function(err) {
    if (err) {
      res.status(400).send({
        message: 'Cannot add review'
      });
    } else {
      res.status(201).send(review);
    }
  });
};

exports.read = function(req, res, next) {
  res.status(200).send(req.review);
};

exports.update = function(req, res, next) {
  const review = req.review;
  review.rating = req.body.rating;
  review.subject = req.body.subject;
  review.content = req.body.content;
  review.save(function(err) {
    if (err) {
      res.status(400).send({
        message: 'Cannot update review'
      });
    } else {
      res.status(200).send(review);
    }
  })
};

exports.delete = function(req, res, next) {
  const review = req.review;
  review.remove(function(err) {
    if (err) {
      res.status(400).send({
        message: 'Cannot delete review'
      });
    } else {
      res.status(204).send();
    }
  })
};

exports.checkAuthorization = function(req, res, next) {
  if (req.review.author.id != req.user.id) {
    res.status(403).send({
      message: 'User is not authorized'
    });
  } else {
    next();
  }
};
