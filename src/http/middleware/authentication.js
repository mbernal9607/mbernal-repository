"use strict";
const jwt = require('jsonwebtoken');
// Configs
const config = require('../../../config-loader');
// Helpers
const ApiError = require('../../helper/api-error');
const Logger = require('../../helper/logger');
const Database = require('../../helper/db');

const logger = new Logger('MW-AUTHENTICATION');

module.exports = async function (req, resp, next) {
    try {
        const { token = null } = req.headers;
        if (!token) throw new ApiError(401, 'Access denied. Missing token.');
        const decodedJWT = jwt.verify(token, config.constants.jwt_secret);
        if(!decodedJWT.id) throw new ApiError(404,"Access denied.");
        // Go for the query and verify if user exists
        const dbh = new Database().dbh;
        const resultPromise = dbh('api_auth')
            .where('api_key', decodedJWT.id)
            .andWhere('is_active', 1)
            .select()
            .timeout(config.constants.dbTimeout, {cancel: true});

        const auth_result = await resultPromise
            .then((rows) => {
                if (rows[0] == null) throw new ApiError(404,"Access denied.");
                return rows[0];
            }).catch((error) => {
                return error;
            });
        if (auth_result.error) throw new ApiError(404, "Access denied.");
        logger.logMessage({ type: "info", message: `API User Authentication OK` });
        // Set auth session data on request
        req.auth_session_data = auth_result;
        // Release DB connection
        dbh.destroy();
        next();
    } catch (error) {
        const status = error.status || 400;
        const message = error.error || "Invalid API token";
        logger.logMessage({ type: "error", message: message });
        resp.status(status).send(new ApiError(status, message));
    }
}