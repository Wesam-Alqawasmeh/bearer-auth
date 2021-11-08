'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes.js');

// Prepare the express app
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

app.get('/', (req, res) => {
  res.status(200).send("Welcome to Wesam bearer auth server!")
})

// Catchalls
app.use(notFound);
app.use(errorHandler);

function start(){
  app.listen(PORT, () => {
    console.log(`Server Up on ${PORT}`)
  })
}

module.exports = {
  server: app,
  start: start
};