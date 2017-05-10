const axios = require('axios');
const moment = require('moment');
const config = require('../../config/config');

const host = config.host;

exports.homeList = function(req, res, next){
  const path ='/api/movies';
  axios.get(host + path)
    .then(function(response) {
      if (response.status == 200 && response.data) {
        res.render('movies-list', {
          user: req.user,
          movies: response.data,
          title: 'Bernoulli'
        })
      } else {
        res.status(200).send('nothing');
      }
    })
    .catch(next);
};

exports.movieInfo = function(req, res, next) {
  const path = '/api/movies/' + req.params.movieid;
  axios.get(host + path)
    .then(function(response) {
      if (response.status == 200 && response.data) {
        const movie = response.data;
        movie.Ratings.forEach(function(rating) {
          movie[rating.Source] = rating.Value
        });
        movie.Writers = movie.Writer;
        movie.Cast = movie.Actors;
        if (movie.reviews) {
          movie.reviews.forEach(function(review) {
            review.createdFormat = moment(review.created).format('LL');
          });
        }
        
        res.render('movie-info', {
          user: req.user,
          movie: movie,
          title: `${movie.Title} (${movie.Year}) | Bernoulli`
        });
      } else {
        res.status(404).send();
      }
    })
    .catch(next);
};

exports.userInfo = function(req, res, next) {
  const path = '/api/users/' + req.params.userid;
  axios.get(host + path)
    .then(function(response) {
      if (response.status == 200 && response.data) {
        const reviews = response.data.reviews;
        if (reviews.length > 0) {
          reviews.forEach(function(review) {
            review.createdFormat = moment(review.created).format('LL');
          });
        }
        res.render('user-info', {
          user: req.user,
          reviews: reviews,
          title: response.data.author.name + '| Bernoulli'
        });
      } else {
        res.status(404).send();
      }
    })
    .catch(next);
};