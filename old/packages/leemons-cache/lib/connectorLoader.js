const importConnector = require('./importConnector');
const nodeCache = require('./nodeCache');

module.exports = async function connectorLoader({ connection }) {
  if (!connection?.connector || connection?.connector === 'node-cache') {
    return nodeCache;
  }

  leemons.log.debug(`Cache connectorLoader > ${connection?.connector}`);
  const connector = await importConnector(connection?.connector);

  return connector;
};
