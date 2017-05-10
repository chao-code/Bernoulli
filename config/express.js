const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const config = require('./config');
const routes = require('../app/routes/index');
const routesAPI = require('../api/routes/index');

const app = express();

app.set('views', './app/views');
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/../public/favicon.ico'));
if (app.get('env') == 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.sessionSecret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/api', routesAPI);

app.use(express.static('./public'));

app.use(function(req, res, next) {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = app.get('env') == 'development'? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;