const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.db);

require('../api/models/users.model');
require('../api/models/reviews.model');