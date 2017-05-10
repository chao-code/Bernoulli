const router = require('express').Router();
const ctrl = require('../controllers/index.controller');

router.get('/', ctrl.homeList);
router.get('/movie/:movieid', ctrl.movieInfo);
router.get('/user/:userid', ctrl.userInfo);

module.exports = router;
