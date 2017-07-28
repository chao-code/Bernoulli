const axios = require('axios');
const cheerio = require('cheerio');
const Review = require('mongoose').model('Review');
const apiKey = require('../../config/config').omdbKey;

const oneHour = 60 * 60 * 1000;
let lastFetchTime = Date.now();
let result;
fetchMovies()
  .then(function(data) {
    result = data;
  });

exports.list = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  let currentTime = Date.now();
  if (currentTime - lastFetchTime < oneHour && result) {
    res.status(200).json(result);
    return;
  }
  fetchMovies()
    .then(function(data) {
      lastFetchTime = currentTime;
      result = data;
      res.status(200).json(result);
    })
    .catch(function(error) {
      if (result)
        res.status(200).json(result);
      else
        next(error);
    });
};

exports.search = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.query.title) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&type=movie&s=${req.query.title}`;
    axios.get(url)
      .then(function(response) {
        res.status(200).json(response.data);
      })
      .catch(next);
  } else {
    res.status(404).send();
  }
};

exports.read = function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  Review.find({movieID: req.movie.imdbID})
    .sort('-created')
    .populate('author', 'name email')
    .exec(function(err, reviews) {
      if (!err && reviews.length > 0) {
        req.movie.reviews = reviews;
      }
      res.status(200).json(req.movie);
    });
};

exports.movieByID = function(req, res, next, movieid) {
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieid}&plot=full`;
  axios.get(url)
    .then(function(response) {
      const movie = response.data;
      if (movie.Response == 'True') {
        req.movie = movie;
        next();
      } else {
        const err = new Error('Cannot find movie ' + movieid);
        err.status = 404;
        next(err);
      }
    })
    .catch(next);
};

function fetchMovies() {
  const urls = {
    mostPopular: 'http://www.imdb.com/chart/moviemeter',
    topRated: 'http://www.imdb.com/chart/top'
  };
  const imgSize = '._V1_SX300_CR0,0,300,420_AL_.jpg';
  function fetchList(url) {
    return axios.get(url)
      .then(function(response) {
        const $ = cheerio.load(response.data);
        const result = [];
        $('#main table.chart tbody tr').each(function() {
          const $this = $(this);
          const rating = $this.find('td.imdbRating strong').text();
          const title = $this.find('td.titleColumn a').text();
          const year = $this.find('td.titleColumn span.secondaryInfo').text();
          const imgURL = $this.find('td.posterColumn img').attr('src');
          const imdbID = $this.find('td.ratingColumn div[data-titleid]').attr('data-titleid');
          result.push({
            title: title,
            year: year.slice(1,5),
            imdbRating: rating,
            imdbID: imdbID,
            poster: imgURL.slice(0, imgURL.indexOf('.', 48)) + imgSize
          })
        });
        return result;
    })
  }
  return Promise.all([fetchList(urls.mostPopular), fetchList(urls.topRated)])
    .then(function(lists) {
      return {
        mostPopular: lists[0],
        topRated: lists[1]
      };
    })
}