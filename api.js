"use strict";
const config = require('./config-loader');
const Logger = require('./src/helper/logger');
const logger = new Logger('INIT');
const mongoose = require('mongoose');
async function startUP() {

    try {
        // Starting API
        logger.logMessage({ type: "warn", message: " ---------- Starting up API (Env: *** development  *** ) ---------- \n" });
        logger.logMessage({ type: "warn", message: "Init configs:"});
        logger.logMessage({ type: "debug", message: JSON.stringify(config) });

        //  Serve routes
        const Router = require('./src/http/router');
        const router = new Router();
        logger.logMessage({ type: "warn", message: "Serving routes" });
        // 'config-loader' file is in charge of bringing the routes from config.yml file
        Object.keys(config.routes).forEach((route) => {
            // Create route instance
            logger.logMessage({ type: "debug", message: config.routes[route].url });
            const ControllerClass = require(config.routes[route].controller);
            const controller = new ControllerClass(config);
            // For each controller exists a getRequestHandler method with the params route (method, callback, middlewares)
            const controllerHandlers = controller.getRequestHandlers();
            router.provideRoute(controllerHandlers);
        });

        // Set documentation with swagger
        router.provideDocumentationRoute();
        // Set handler for incoming invalid routes
        router.handleInvalidRoute();
        // Checking DBs connection
        await checkMongoDBConnection()
        // Start HTTP server
        router.startServer();
    } catch (error) {
        console.log('error....', error)
        logger.logMessage({ type: "error", message: error });
    }
}

startUP();

async function checkMongoDBConnection(){
    //connect to mongoDB
    const uri = `mongodb+srv://${config.constants.mongoDB.user}:${config.constants.mongoDB.password}@cluster0.2lufllv.mongodb.net/playground?retryWrites=true&w=majority`;

    await mongoose.connect(uri)
        .then(() => logger.logMessage({ type: "warn", message: " ---------- Connected to MongoDB ---------- \n" }))
        .catch((error) => console.error(error));
}