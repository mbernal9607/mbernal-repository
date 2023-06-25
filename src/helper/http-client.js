'use-strict';

const ApiError = require('../helper/api-error');
const Logger = require('../helper/logger');
const superAgent = require('superagent');
const util = require('../helper/util');

class HttpClient {

    /**
     * Basic HTTP client
     * @param {Object} apiSettings Basic settings for http client.
     * @param {URL} apiSettings.apiURL Base URL of the 3rd party API.
     * @param {string} apiSettings.contentType Default content type header to be sent.
     * @param {string} apiSettings.clientName Client name for debugging purposes.
     * @param {string} apiSettings.accept Default 'accept' header to be sent.
     * @param {Object} apiSettings.parser Custom parser.
     */
    constructor (apiSettings) {
        this.apiURL = apiSettings.apiURL;
        this.apiPort = apiSettings.apiPort;
        this.apiHeaders = apiSettings.apiHeaders;
        this.clientName = apiSettings.clientName;
        this.parser = apiSettings.parser || undefined;
    }

    /**
     * Send HTTP request
     * @param {Object} requestData Request information.
     * @param {string} requestData.method Either 'post', 'get', 'put' or 'delete'.
     * @param {string} requestData.resource Resource/endpoint to be added to the basic URL.
     * @param {Object} requestData.payload Optional. The payload to be sent as request body.
     * @param {Object} requestData.headers Optional. The request specific headers.
     * @param {Object} requestData.options Optional. The request additional options (debugging, others).
     */


    async send(requestData) {
        // Dynamic logger name according to client name
        const logger = new Logger('HTTP-CLIENT|' + this.clientName);

        const { error } = util.validateHTTPReq(requestData);
        if (error) return error;

        const port = (requestData.port) ? ":" + requestData.port : (this.apiPort) ?  ":" + this.apiPort : "";
        const url = this.apiURL + port + requestData.resource;

        const headers = {};
        this.apiHeaders.forEach(header => {
            headers[header.key] = header.value;
        });

        // Adding/Overriding per-request specific headers
        if (requestData.headers) {
            requestData.headers.forEach(header => {
                headers[header.key] = header.value;
            });
        }

        try {
            let serviceResponse = await superAgent[requestData.method](url)
                .set(headers)
                .buffer((this.parser))
                .parse(this.parser)
                .send(requestData.body)
                .timeout({
                    response: 60000,
                });
            if (serviceResponse.text == null) throw new ApiError(500, "Invalid response");
            logger.logMessage({ type: "debug", message: serviceResponse.text });

            let response = serviceResponse.text;
            if (headers["Accept"] === "application/json" && response !== "") {
                response = JSON.parse(serviceResponse.text);
            }

            return response;

        } catch (error) {
            const status = (error.status) ? error.status : 500;
            const errorMessage = (error.response) ? error.response.text : error+"";
            logger.logMessage({ type: "error", message: errorMessage });
            return new ApiError(status, errorMessage);
        }
    }
}

module.exports = HttpClient;