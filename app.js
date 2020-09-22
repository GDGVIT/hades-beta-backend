const express = require('express');
const compression = require('compression');

const morgan = require('./logging/morgan');
const index = require('./routes/index');
const email = require('./routes/email');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logging/logger');

dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    logger.error(err);
    process.exit(2);
  }

  logger.info('MongoDB connection established');
});

// Middlewares
app.use(express.json());
app.use(compression());

// Logging
app.use(morgan);

// Mount routes
app.use('/', index);
app.use('/email', email);

module.exports = app;
