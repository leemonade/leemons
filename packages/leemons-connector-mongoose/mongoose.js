const mongoose = require('mongoose');
const _ = require('lodash');

function percentEncoding(str) {
  return str.replace(/[ :/?#[\]@]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
}

function encodeMongoURI(config) {
  const user =
    config.connection.user && config.connection.password
      ? `${percentEncoding(config.connection.user)}:${percentEncoding(config.connection.password)}@`
      : '';

  const protocol = config.connection.srv ? 'mongodb+srv' : 'mongodb';

  const hosts = [
    { host: config.connection.host, port: config.connection.srv ? null : config.connection.port },
    ...config.replicaSet,
  ].map(({ host, port }) => {
    const _port = port ? `:${port}` : '';
    return `${host}${_port}`;
  });

  return `${protocol}://${user}${hosts}/${config.connection.database || ''}`;
}

function getMongoConnection(connection) {
  return new Promise((resolve, reject) => {
    const isFalsy = (value) => !['true', true, 1, '1'].includes(value);

    const config = {
      pool: {
        min: _.get(connection.settings, 'pool.min', 5),
        max: _.get(connection.settings, 'pool.max', 50),
      },
      connection: {
        host: _.get(connection.settings, 'host'),
        port: _.get(connection.settings, 'port'),
        database: _.get(connection.settings, 'database'),
        authDatabase: _.get(connection.settings, 'authDatabase'),
        user: _.get(connection.settings, 'username') || _.get(connection.settings, 'user'),
        password: _.get(connection.settings, 'password'),
        srv: !isFalsy(_.get(connection.settings, 'srv', false)),
      },

      replicaSet: _.get(connection.settings, 'replicaSet', []),
    };

    const URI = encodeMongoURI(config);
    const options = {
      maxPoolSize: config.pool.max,
      minPoolSize: config.pool.min,
      authSource: config.connection.authDatabase,
    };

    mongoose.createConnection(URI, options, (err, conn) => {
      if (err) {
        return reject(err);
      }
      return resolve(conn);
    });
  });
}

async function initMongooseConnections(connector, connections) {
  return Promise.all(
    connections.map(async (connection) => {
      // If the connection is already initialized don't do anything
      if (_.has(connector, `connections.${connection.name}`)) {
        return;
      }
      try {
        const dbConnection = await getMongoConnection(connection);

        // Save the connection
        _.set(connector, `connections.${connection.name}`, dbConnection);
      } catch (e) {
        throw new Error(
          `Can't connect to database in ${connection.name} connection. Check if the database is running. (${e.code} - ${e.codeName})`
        );
      }
    })
  );
}

module.exports = initMongooseConnections;
