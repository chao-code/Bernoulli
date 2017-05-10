let port = process.env.PORT || 3000;
let db = 'mongodb://localhost/myapp';
let host = 'http://localhost:3000';
let sessionSecret = 'ThisisaSecret';

if (process.env.NODE_ENV == 'production') {
  db = process.env.MONGO_URI;
  host = process.env.HOST;
  sessionSecret = process.env.SESSION_SECRET;
}

module.exports = {
  port: port,
  db: db,
  host: host,
  sessionSecret: sessionSecret
};