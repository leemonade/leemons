const importConnector = require('./importConnector');
const nodeCache = require('./nodeCache');

module.exports = async function connectorLoader({ connection }) {
  if (!connection?.connector || connection?.connector === 'node-cache') {
    return nodeCache;
  }

  const connector = await importConnector(connection?.connector);

  return connector;
};
