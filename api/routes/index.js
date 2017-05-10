const router = require('express').Router();
const movies = require('../controllers/movies.controller');
const reviews = require('../controllers/reviews.controller');
const users = require('../controllers/users.controller');

router.param('movieid', movies.movieByID);
router.get('/movies', movies.list);
router.get('/movies/:movieid', movies.read);
router.get('/search', movies.search);

router.param('reviewid', reviews.reviewByID);
router.route('/reviews')
  .get(reviews.list)
  .post(users.authenticate, reviews.create);
router.route('/reviews/:reviewid')
  .get(reviews.read)
  .put(users.authenticate, reviews.checkAuthorization, reviews.update)
  .delete(users.authenticate, reviews.checkAuthorization, reviews.delete);

router.get('/users/:userid', users.read);
router.post('/auth/signup', users.signup);
router.post('/auth/login', users.login);
router.get('/auth/logout', users.logout);

module.exports = router;