require('./config/mongoose');
require('./config/passport')
const app = require('./config/express');
const config = require('./config/config');

app.set('port', config.port);

app.listen(app.get('port'));

console.log('Server listening on port: ' + app.get('port'));

module.exports = app;