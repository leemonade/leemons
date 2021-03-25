const importConnector = require('./importConnector');

function createConnectorRegistry({ connections, defaultConnection }, databaseManager) {
  const connectors = new Map();
  return {
    load: () => {
      // Register each different connector
      Object.values(connections).forEach((connection) => {
        const { connector } = connection;
        if (!connectors.has(connector)) {
          connectors.set(connector, importConnector(connector)(databaseManager.leemons));
        }
      });
    },

    init: (models) =>
      Promise.all(
        [...connectors.values()].map((connector) =>
          connector.init(models).then(() => {
            [...connector.models.entries()].forEach(([key, value]) => {
              databaseManager.models.set(key, value);
            });
          })
        )
      ),

    getAll: () => [...connectors.values()],

    get: (key) => connectors.get(key),

    getFromConnection: (key) => connectors.get(connections[key].connector),

    set: (key, value) => connectors.set(key, value),

    get default() {
      return this.get(connections[defaultConnection].connector);
    },
  };
}

module.exports = createConnectorRegistry;
