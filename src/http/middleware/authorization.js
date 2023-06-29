"use strict";
// Configs
const config = require('../../../config-loader');
// Helpers
const ApiError = require('../../helper/api-error');
const Logger = require('../../helper/logger');
const Database = require('../../helper/db');

const logger = new Logger('MW-AUTHORIZATION');

module.exports = async function (req, resp, next) {
    try {
        const { auth_session_data, route: { path }, method } = req;
        const dbh = new Database().dbh;
        const result = dbh('access_level_methods')
            .where('id_access_level', auth_session_data.id_access_level)
            .andWhere('route', path)
            .andWhere('method', method)
            .select()
            .timeout(config.constants.dbTimeout, {cancel: true});

        const auth_result = await result
            .then((rows) => {
                if (rows[0] == null) throw new ApiError(404,"Access denied.");
                return rows[0];
            }).catch((error) => {
                return error;
            });
        if (auth_result.error) throw new ApiError(404,"Access denied.");
        logger.logMessage({ type: "info", message: `API User Authorization OK` });
        // Release DB connection
        dbh.destroy();
        next();
    } catch (error) {
        console.log('error....', error)
        const status = error.status || 400;
        const message = error.error || "Access denied.";
        logger.logMessage({ type: "error", message: message });
        resp.status(status).send(new ApiError(status, message));
    }
}