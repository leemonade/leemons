const importConnector = require('./importConnector');

function createConnectorRegistry({ connections, defaultConnection }, leemons) {
  const connectors = new Map();
  return {
    load: () => {
      // Register each different connector
      Object.values(connections).forEach((connection) => {
        const { connector } = connection;
        if (!connectors.has(connector)) {
          connectors.set(connector, importConnector(connector)(leemons));
        }
      });
    },

    init: () => Promise.all([...connectors.values()].map((connector) => connector.init())),

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
