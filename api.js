"use strict";
const mongoose = require('mongoose');
async function startUP() {

    try {
        // Starting API
        const config = require('./config-loader');
        const Logger = require('./src/helper/logger');
        const logger = new Logger('INIT');

        logger.logMessage({ type: "warn", message: " ---------- Starting up API (Env: *** development  *** ) ---------- \n" });
        logger.logMessage({ type: "warn", message: "Init configs:"});
        logger.logMessage({ type: "debug", message: JSON.stringify(config) });

        //  Serve routes
        const Router = require('./src/http/router');
        const router = new Router();
        logger.logMessage({ type: "warn", message: "Serving routes"});
        Object.keys(config.routes).forEach((route) => {
            // Create route instance
            logger.logMessage({ type: "debug", message: config.routes[route].url });
            const ControllerClass = require(config.routes[route].controller);
            const controller = new ControllerClass(config);
            const controllerHandlers = controller.getRequestHandlers();
            router.provideRoute(controllerHandlers);
        });

        // Set handler for invalid routes
        router.handleInvalidRoute();

        // Start HTTP server
        router.startServer();
        //connect to mongoDB
        const uri = `mongodb+srv://mcaminos:6jXaNdNDlvoJNV8g@cluster0.2lufllv.mongodb.net/playground?retryWrites=true&w=majority`;

        mongoose.connect(uri)
            .then(() => logger.logMessage({ type: "warn", message: " Connected to MongoDB  \n" }))
            .catch((error) => console.error(error));
    } catch (error) {
        console.log(' errrrr...', error);
    }
}

startUP();