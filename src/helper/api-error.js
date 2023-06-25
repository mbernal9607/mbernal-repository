'use strict'

class ApiError {

    /**
     * Basic custom template for request errors
     * @param {number}  status    - Represents the HTTP status code to be returned
     * @param {string}  message        - The error description
     */
    constructor(status, message) {
        this.status = status;
        this.error = message;
    }
};

module.exports = ApiError;