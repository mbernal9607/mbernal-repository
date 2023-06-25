"use strict";

const winston = require('winston');

class Logger {

	constructor(component, sid) {
		this.component = component;
		this.sid = sid || '';
		this.enabled = true;
	}

	logMessage(args) {

		if (!this.enabled) return;
		if (args.message == null) throw new Error("Missing 'message' for logger.logMessage(code,message,sid)");

		const colorizer = winston.format.colorize();
		const log_output = this.__setOutputLog({
			sid: args.sid || this.sid,
			log_level: args.type,
			component: this.component,
			message: args.message,
		});

		const logger = winston.createLogger({
			level: args.type,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.simple(),
				winston.format.printf(msg =>
					colorizer.colorize(msg.level, msg.message)
				)
			),
			transports: [
				new winston.transports.Console(),
			]
		});

		logger.log({message: log_output, level: args.type});
	}

  	logHTTP(args) {
		if (args.request) {
			this.logMessage({ type: "verbose", message: ">>> NEW REQUEST >>> ", });
			this.logMessage({ type: "verbose", message: ">>> " + args.request.method + " " + args.request.url });
			this.logMessage({ type: "verbose", message: ">>> Headers: " + JSON.stringify(args.request.headers) });
			if ( args.request.body != null )
				this.logMessage({ type: "verbose", message: ">>> Request data: " + JSON.stringify(args.request.body) });
		} else if (args.response) {
			this.logMessage({ type: "verbose", message: "<<< RESPONSE <<<" });
			this.logMessage({ type: "verbose", message: "<<< HTTP status code: " + args.response.status });
			this.logMessage({ type: "verbose", message: "<<< Headers: " + JSON.stringify(args.response.headers) });
			this.logMessage({ type: "verbose", message: "<<< Response data: " + JSON.stringify(args.response.body) });
			this.logMessage({ type: "verbose", message: "Elapsed time (" + args.response.eta + " s)" });
		}
    }

	__setOutputLog({ component, log_level, message }){
		const now = new Date();
		const log_output_date = `[${now.toISOString()}]`;
		const log_output = `${log_output_date}  [${component}][${log_level}]: ${message}`;
		return log_output;
	}
}

module.exports = Logger;