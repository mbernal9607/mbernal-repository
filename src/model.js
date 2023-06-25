"use strict";
const Joi = require('joi')
    .extend(require('@hapi/joi-date'));
const ApiError = require('./helper/api-error');

class Model {
    /**
     * Loads a specific character info based on specified criteria.
     * @param {Object} validationRules Object containing the 
     * @returns {Object} A Model object, with a validate() method.
     */
    constructor() {
        this.schema = {};
        this.validator = Joi;
    }

    setSchema(schema) {
        this.schema = schema;
    }

    validate(ruleSet, data) {

        try {
            // Attach validation rules
            const rules = this.validator.object().keys(ruleSet.keys);
            // Validate each of the included search params
            const { error } = rules.validate(data);
            if (error) return new ApiError(400, error.details[0].message);

            // If success
            return { success: true };
        } catch (error) {
            return new ApiError(500, error+"");
        }
    }
}

module.exports = Model;
