const config = require('../../config-loader');

const defaultConnSettings = {
    client: "mysql",
    connection: {
        host: config.constants.mysqlDB.host,
        user: config.constants.mysqlDB.user,
        port: config.constants.mysqlDB.port,
        password: config.constants.mysqlDB.password,
        database: config.constants.mysqlDB.database
    },
    useNullAsDefault: true
};


class Database {

    constructor(connSettings = null) {
        const conn = (connSettings == null) ? defaultConnSettings : connSettings;
        this.dbh = require('knex')(conn);
    }
}

module.exports = Database;
