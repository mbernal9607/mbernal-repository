const Model = require('../../model');
const Util = require('../../helper/util');
const Logger = require('../../helper/logger');
const ApiError = require('../../helper/api-error');
// Service
const RAMService = require('../../service/rickandmorty.service');

const logger = new Logger('model.rickandmorty.character');

class CharacterModel extends Model {
    constructor() {
        super();
        this.setSchema({
            id: this.validator.number(),
        });
    }

    async load(params) {
        try {
            //  1. Params validation
            const search_params = {
                keys: Util.getFromObject(this.schema, Object.keys(params)),
            }
            const validation = super.validate(search_params, params);
            if (validation.success == null) throw validation;
            const service = new RAMService();
            const character_info = await service.getCharacter(params.id);
            if (character_info.error) throw new ApiError(character_info.status, JSON.parse(character_info.error).error);
            const { url , episode, location, type, origin, ...response } = character_info;
            return response;
        } catch (err) {
            const err_msg = err.error ? err.error : err;
            logger.logMessage({ type: "error", message: err_msg });
            return err;
        }
    }
}

module.exports = CharacterModel;