const knex = require('knex');
const _ = require('lodash');

const CLIENTS = {
  postgre: 'pg',
  sqlite: 'sqlite3',
  mysql: 'mysql',
  mysql2: 'mysql2',
};

const CONNECTION_FILTERS = {
  mysql2: (config) =>
    _.pick(config, [
      'charset',
      'database',
      'host',
      'password',
      'port',
      'socketPath',
      'database',
      'ssl',
      'timezone',
      'user',
      'multipleStatements',
    ]),
};

async function initKnex(connector, connections) {
  return Promise.all(
    connections.map(async (connection) => {
      // If the connection is already initialized don't do anything
      if (_.has(connector, `connections.${connection.name}`)) {
        return;
      }

      // Check which client is using
      let client;
      switch (connection.settings.client) {
        case 'mysql':
          client = CLIENTS.mysql;
          break;
        case 'mysql2':
          client = CLIENTS.mysql2;
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
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        require(client);
      } catch (e) {
        throw new Error(`The desired db client is not installed, try yarn add ${client}`);
      }

      const config = {
        client,
        pool: {
          min: _.get(connection.settings, 'pool.min', 5),
          max: _.get(connection.settings, 'pool.max', 50),
        },
        connection: {
          charset: _.get(connection.settings, 'charset', 'utf8mb4'),
          database: _.get(connection.settings, 'database'),
          filename: _.get(connection.settings, 'filename', '.tmp/data.db'),
          host: _.get(connection.settings, 'host'),
          password: _.get(connection.settings, 'password'),
          port: _.get(connection.settings, 'port'),
          schema: _.get(connection.settings, 'schema', 'public'),
          socketPath: _.get(connection.settings, 'socketPath'),
          ssl: _.get(connection.settings, 'ssl', false),
          timezone: _.get(connection.settings, 'timezone', '+00:00'),
          user: _.get(connection.settings, 'username') || _.get(connection.settings, 'user'),
          multipleStatements: true,
        },
      };

      if (_.has(CONNECTION_FILTERS, client)) {
        config.connection = CONNECTION_FILTERS[client](config.connection);
      }

      let dbConnection;
      try {
        dbConnection = knex(config);
        // Test connection
        await dbConnection.schema.hasTable('core_store');
      } catch (e) {
        console.error(e);
        throw new Error(
          `Can't connect to the database in ${connection.name} connection. Check if the database is running. (${e.code} - ${e.sqlMessage})`
        );
      }
      // Save the connection
      _.set(connector, `connections.${connection.name}`, {
        connection: dbConnection,
        config: {
          useCustomRollback: _.get(connection, 'useCustomRollback', false),
        },
      });
    })
  );
}

module.exports = {
  initKnex,
};
