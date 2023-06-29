"use strict";

// Configs
const config = require('../../../config-loader');
// Model
const UserModel = require('../../model/user.model')
class User {

    constructor() {
        this.routeConf = config.routes.user;
    }

    getRequestHandlers() {
        return [
            {
                httpMethod: 'get',
                url: this.routeConf.url,
                middleware: this.routeConf.middleware,
                callback: this.listUsers
            },
            {
                httpMethod: 'get',
                url: this.routeConf.url + '/:id',
                middleware: this.routeConf.middleware,
                callback: this.getById
            },
            {
                httpMethod: 'post',
                url: this.routeConf.url,
                middleware: this.routeConf.middleware,
                callback: this.create
            },
            {
                httpMethod: 'put',
                url: this.routeConf.url + '/:id',
                middleware: this.routeConf.middleware,
                callback: this.update
            },
            {
                httpMethod: 'delete',
                url: this.routeConf.url + '/:_id',
                middleware: this.routeConf.middleware,
                callback: this.delete
            },
        ];
    }
    async listUsers(request) {
        const user_model = new UserModel();
        const response = await user_model.listUsers();
        return response;
    }

    async getById(request) {
        const search_by = request?.query?.searchBy || 'id';
        const params = {
            [search_by]: request.params.id
        }
        const user_model = new UserModel();
        const response = await user_model.getById(params);
        return response;

    }

    async create(request) {
        const user_model = new UserModel();
        const response = await user_model.create(request.body);
        return response;
    }

    async update(request) {
        const user_model = new UserModel();
        const response = await user_model.update(request.params.id, request.body);
        return response;
    }

    async delete(request) {
        const params = {
            _id: request.params._id
        }
        const user_model = new UserModel();
        const response = await user_model.delete(params);
        return response;
    }
}
module.exports = User;
