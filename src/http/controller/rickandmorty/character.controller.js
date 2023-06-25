"use strict";

// Configs
const config = require('../../../../config-loader');
// Model
const CharacterModel = require('../../../model/rickandmorty/character.model');
class Character {

    constructor() {
        this.routeConf = config.routes.character;
    }

    getRequestHandlers() {
        return [
            {
                httpMethod: 'get',
                url: this.routeConf.url + '/:id',
                middleware: this.routeConf.middleware,
                callback: this.load
            },
        ];
    }

    async load(request) {
        const params = {
            id: request.params.id
        }
        const character_model = new CharacterModel();
        const response = await character_model.load(params);
        return response;
    }
}
module.exports = Character;
