const lodash = require('lodash');
const Joi = require('joi');
class Utils {
    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let string = '';
        for ( let i = 0; i < length; i++ ) {
            string += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return string;
    }
    // Given an object, returns a copy with onl the specified keys
    getFromObject (object,keys) {
        return lodash.pick(object,keys);
    }

    validateHTTPReq(request) {
        // Validate each of the included search params
        const { error } = Joi.object().keys({
                resource: Joi.string().required(),
                method: Joi.string().allow('GET','POST','PUT','DELETE').required(),
                headers: Joi.array(),
                body: Joi.string(),
                port: Joi.number().integer(),
                downloadFileData: Joi.object(),
                options: Joi.object()
            })
            .validate(request);
        if (error) return new ApiError(400, error.details[0].message);

        // If success
        return { success: true };
    }
}

module.exports = new Utils();