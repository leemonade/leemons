const knex = require('knex');
const _ = require('lodash');

const CLIENTS = {
  postgre: 'pg',
  sqlite: 'sqlite3',
  mysql: 'mysql',
};

function initKnex(leemons, connections) {
  connections.forEach((connection) => {
    // Check which client is using
    let client;
    switch (connection.settings.client) {
      case 'mysql':
        client = CLIENTS.mysql;
        break;
      case 'postgre':
      case 'postgres':
      case 'postgresql':
        client = CLIENTS.postgre;
        break;
      case 'sqlite':
      case 'sqlite3':
        client = CLIENTS.sqlite;
        break;
      default:
        throw new Error('The provided SQL client is not supported');
    }

    // Check if the db client is installed
    let clientPackage;
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      clientPackage = require(client);
      console.log(clientPackage);
    } catch (e) {
      throw new Error(`The desired db client is not installed, try yarn add ${client}`);
    }

    // TODO: Set the connection config
    const config = {
      client,
      connection: {
        charset: _.get(connection.settings, 'charset'),
        database: _.get(connection.settings, 'database'),
        filename: _.get(connection.settings, 'filename', '.tmp/data.db'),
        host: _.get(connection.settings, 'host'),
        password: _.get(connection.settings, 'password'),
        port: _.get(connection.settings, 'port'),
        schema: _.get(connection.settings, 'schema', 'public'),
        socketPath: _.get(connection.settings, 'socketPath'),
        ssl: _.get(connection.settings, 'ssl', false),
        timezone: _.get(connection.settings, 'timezone', 'utc'),
        user: _.get(connection.settings, 'username') || _.get(connection.settings, 'user'),
      },
    };

    try {
      const dbConnection = knex(config);
      _.set(leemons, `connections.${connection.name}`, dbConnection);
    } catch (e) {
      throw new Error('Erorr in knex initialization');
    }
  });
}

module.exports = {
  initKnex,
};
