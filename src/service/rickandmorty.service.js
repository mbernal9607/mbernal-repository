const HttpClient = require('../helper/http-client');
const Logger = require('../helper/logger');
const ApiError = require('../helper/api-error');

const logger = new Logger('RICKANDMORTYSERVICE');
// HTTP client settings
const httpClient = new HttpClient({
    clientName: "Rickandmorty",
    apiURL: 'https://rickandmortyapi.com/api',
    apiHeaders: [
        { key: "Content-Type", value: "application/json" },
        { key: "Accept", value: "application/json" }
    ],
    apiPort: null
});


class Rickandmorty {

    async getCharacter(character_id) {
        try {
            // 1. Set request info
            const request_data = {
                method: "get",
                resource: `/character/${character_id}`,
            };
            // 2. Send the request
            const response = await this._makeRequest(request_data);
            return response;
        } catch (error) {
            logger.logMessage({ type: "error", message: error.error });
            throw new error;
        }
    }

    async _makeRequest (request_data) {
        return await httpClient.send(request_data);
    }
}

module.exports = Rickandmorty;