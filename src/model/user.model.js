const Model = require('../model');
const Util = require('../helper/util');
const Logger = require('../helper/logger');

const logger = new Logger('model.user')
// Schema
const UserSchema = require('../model/userSquema');

class UserModel extends Model {
    constructor() {
        super();
        this.setSchema({
            user_id: this.validator.string(),
            id: this.validator.number().required(),
            name: this.validator.string().required(),
            email: this.validator.string().required(),
        });
    }

    async listUsers() {
        try {
            const users_result = await UserSchema.find();
            return users_result;
        }catch (err) {
            const err_msg = err.error ? err.error : err;
            logger.logMessage({ type: "error", message: err_msg });
            return err;
        }
    }
    async getById(params) {
        try {
            //  1. Params validation
            const search_params = {
                keys: Util.getFromObject(this.schema, Object.keys(params)),
            }
            const validation = super.validate(search_params, params);
            if (validation.success == null) throw validation;
            const user_result = await UserSchema.find(params);
            return user_result;
        }catch (err) {
            const err_msg = err.error ? err.error : err;
            logger.logMessage({ type: "error", message: err_msg });
            return err;
        }
    }

    async create(userInfo) {
        try {
            //  1. Params validation
            const search_params = {
                keys: Util.getFromObject(this.schema, Object.keys(userInfo)),
            }
            const validation = super.validate(search_params, userInfo);
            if (validation.success == null) throw validation;
            const user = UserSchema(userInfo);
            const user_result = await user.save();
            return user_result;
        } catch (err) {
            const err_msg = err.error ? err.error : err;
            logger.logMessage({ type: "error", message: err_msg });
            return err;
        }
    }

    async update(user_id, userInfo) {
        try {
            //  1. userInfo validation
            const user_params = {
                keys: Util.getFromObject(this.schema, Object.keys(userInfo)),
            }
            const user_params_validation = super.validate(user_params, userInfo);
            if (user_params_validation.success == null) throw user_params_validation;
            const response = UserSchema
                .updateOne({ _id: user_id }, { $set: userInfo })
                .then((data) => data)
                .catch((error) => error);

            return response;
        } catch (err) {
            const err_msg = err.error ? err.error : err;
            logger.logMessage({ type: "error", message: err_msg });
            return err;
        }
    }
}

module.exports = UserModel;