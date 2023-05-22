const { isArray, get } = require('lodash');
const { createClient, createCluster } = require('redis');

function clientConfig(client) {
  return {
    socket: {
      host: get(client, 'host', undefined),
      port: get(client, 'port', undefined),
    },
    username: get(client, 'username', undefined),
    password: get(client, 'password', undefined),
    name: get(client, 'name', 'leemons-backend-client'),
    database: get(client, 'database', '0'),
  };
}

module.exports = function createClients(config) {
  if (config.client) {
    leemons.log.debug(`Connecting to REDIS, using: ${JSON.stringify(config.client)}`);
    return createClient(clientConfig(config.client));
  }
  if (config.clients) {
    if (!isArray(config.clients)) {
      throw new Error(
        'Clients config should be an array to work with leemons-cache-connector-redis'
      );
    }

    return createCluster({
      rootNodes: config.clients.map(clientConfig),
      useReplicas: get(config, 'replicas', false),
    });
  }

  throw new Error(
    'At leat client or clients must be provided to use leemons-cache-connector-redis'
  );
};
