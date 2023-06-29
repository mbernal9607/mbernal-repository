"use strict";

/**
 * This helper file takes config.yaml and interpolates environment variables for the specified keys
 */
const yaml = require('read-yaml');
const config = yaml.sync('./config.yml');

// Adding API_HOME to route controllers
Object.keys(config.routes).forEach(route => {
    config.routes[route].controller = './src/http/controller' + config.routes[route].controller
});

// Contants
// Mongo DB
config.constants.mongoDB.user = config.constants.mongoDB.user;
config.constants.mongoDB.password = config.constants.mongoDB.password;
config.constants.accessTokenHeader = config.constants.accessTokenHeader;

module.exports = config;