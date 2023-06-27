const _ = require('lodash');
const { createClient } = require('redis');
const queries = require('./queries');

function getClientConfig(config) {
  if (_.isString(config)) {
    return { url: config };
  }
  return {
    socket: {
      host: _.get(config, 'host', undefined),
      port: _.get(config, 'port', undefined),
    },
    username: _.get(config, 'username', undefined),
    password: _.get(config, 'password', undefined),
    name: _.get(config, 'name', 'leemons-backend-client'),
    database: _.get(config, 'database', '0'),
  };
}

module.exports = async function redisCache(config) {
  const client = createClient(getClientConfig(config));

  client.on('error', (error) => leemons.log.error(`Redis Error: ${error.message}`));

  await client.connect();

  return queries(client);
};
