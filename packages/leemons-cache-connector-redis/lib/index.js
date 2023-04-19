const createClients = require('./createClients');
const queries = require('./queries');

module.exports = async function initRedis({ config, leemons }) {
  const client = createClients(config);

  client.on('error', (error) => leemons.log.error(`Reids Cluster Error: ${error.message}`));

  await client.connect();

  return queries(client);
};
