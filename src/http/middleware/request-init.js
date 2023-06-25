"use strict";

// Configs
const config = require('../../../config-loader');
const Logger = require('../../helper/logger');
const logger = new Logger('MW-REQ-INIT');
const Util = require('../../helper/util');


module.exports = function (req, resp, next) {

    // Generate Request ID
    req.requestId = Util.generateRandomString(40);
    req.requestInitTime = new Date().getTime();
    // Set the unique request id to both request/response headers
    req.header[config.constants.requestIdHeader] = req.requestId;
    resp.set(config.constants.requestIdHeader, req.requestId);
    // check if transaction ID header is in the request before setting in the response
    if (req.headers[config.constants.transactionIdHeader]) {
        resp.set(config.constants.transactionIdHeader, req.header(config.constants.transactionIdHeader));
        session_object.client_transaction_id = req.header(config.constants.transactionIdHeader);
    }
    // Log request
    logger.logHTTP({ request: req });
    next();
};