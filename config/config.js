let port = process.env.PORT || 3000;
let db = 'mongodb://localhost/myapp';
let host = 'http://localhost:3000';
let sessionSecret = 'ThisisaSecret';
let omdbKey = '1dc693b3';

if (process.env.NODE_ENV == 'production') {
  db = process.env.MONGO_URI;
  host = process.env.HOST;
  sessionSecret = process.env.SESSION_SECRET;
  omdbKey = process.env.OMDB_KEY;
}

module.exports = {
  port: port,
  db: db,
  host: host,
  sessionSecret: sessionSecret,
  omdbKey: omdbKey
};