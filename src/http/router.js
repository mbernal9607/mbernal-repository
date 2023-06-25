"use strict";

const express = require('express');

const Logger = require('../helper/logger');
const ApiError = require('../helper/api-error');

const logger = new Logger('ROUTER');

// Load Middlewares
const middlewares = {
    requestInit: require('../http/middleware/request-init'),
};

class Router {

    constructor () {
        // Initializing Express basic features
        this.app = express();
        this.app.use(express.json());
        // Express configs
        this.port = process.env.PORT || 5000
        this.url = "";
        this.response = {
            status: 200,
            body: {
                data: {}
            },
            eta: 0
        };
    }

    startServer() {
        // Start HTTP server
        this.app.listen(this.port, () => {
            logger.logMessage({ type: "warn", message: ` ---------- Server listining on port [ ${this.port} ] ---------- ` });
        });
    }

    provideRoute(handlers) {
        // Add HTTP method handlers for each controller
        handlers.forEach(reqHandler => {
            this.setRequestHandlers(reqHandler);
        });
    }

    setRequestHandlers(args) {

        const httpMethod = args.httpMethod;
        const url = args.url;
        const callback = args.callback;

        // Set middleware list
        const reqMiddlewares = [];
        if (args.middleware != null) args.middleware.forEach(midwr => {
            reqMiddlewares.push(middlewares[midwr]);
        });

        this.app[httpMethod](url, reqMiddlewares, async (req, resp) => {

            // Handle promise returned by each controller
            this.response.body = await callback(req);
            if (Object.getPrototypeOf(this.response.body) === ApiError.prototype) {
                this.response.status = this.response.body.status || 500;
            } else {
                // Default '200' as response status
                this.response.status = 200;
            }

            if (req.headers.accept == 'text/xml') {
                resp.header('Content-Type', 'text/xml');
            }
            // This is for regular JSON responses
            const responseObj = resp.status(this.response.status).send(this.response.body);
            this.response.headers = responseObj.getHeaders();
            const requestEndTime = new Date().getTime();
            this.response.eta = (requestEndTime - req.requestInitTime) / 1000;
            if (resp.headersSent) {
                logger.logHTTP({ response: this.response });
            }
        });
    }

    handleInvalidRoute() {
        // Handle unexisting routes
        this.app.use(function(request, response, next) {
            if (!request.route){
                response.status(404).send(new ApiError(404, "Invalid request"));
            } else {
                next();
            }
        });
    }
}

module.exports = Router;
