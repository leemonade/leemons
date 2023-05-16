const _ = require('lodash');
const importConnector = require('./importConnector');

function createConnectorRegistry({ connections, defaultConnection }, databaseManager) {
  if (connections === null) {
    throw new Error('No connection is provided');
  }
  if (!Object.keys(connections).includes(defaultConnection)) {
    throw new Error(`The defaultConnection ${defaultConnection} does not exists in connections`);
  }

  const connectors = new Map();
  return {
    /**
     * Loads and import each database connector based on the connections
     */
    load: () => {
      // Register each different connector
      Object.values(connections).forEach((connection) => {
        const { connector } = connection;
        if (!connectors.has(connector)) {
          connectors.set(connector, importConnector(connector)(databaseManager.leemons));
        }
      });
    },

    /**
     * Initializes each connector
     */
    init: async () =>
      Promise.all(
        [...connectors.values()].map(async (connector) => {
          // Initialize connector
          await connector.init();
        })
      ),

    destroy: async () =>
      Promise.all([...connectors.values()].map((connector) => connector.destroy())),

    /**
     * Loads each provided model on its corresponding connection and connector
     * @param {Model} coreStore
     * @param {Model[]} models
     * @returns {Promise}
     */
    loadModels: async (coreStore, models) => {
      // Load core_store model
      if (!databaseManager.models.has('models::core_store')) {
        const coreStoreConnector = connectors.get(connections[coreStore.connection].connector);
        await coreStoreConnector.loadModels([coreStore]);
        databaseManager.models.set(
          'models::core_store',
          coreStoreConnector.models.get('models::core_store')
        );
      }

      // Get the other models grouped by connection
      const modelsByConnector = _.groupBy(
        Object.values(models).map((model) => ({
          ...model,
          connector: connections[model.connection].connector,
        })),
        'connector'
      );

      // Load each connector models
      return Promise.all(
        [...connectors.entries()].map(async ([name, connector]) => {
          const connectorModels = modelsByConnector[name];

          if (!connectorModels?.length) {
            return;
          }

          // Load connector models
          await connector.loadModels(connectorModels);

          // Save connector models
          [...connector.models.entries()].forEach(([key, value]) => {
            databaseManager.models.set(key, value);
          });
        })
      );
    },

    getAll: () => [...connectors.values()],

    get: (key) => connectors.get(key),

    getFromConnection: (key) => connectors.get(connections[key].connector),

    set: (key, value) => connectors.set(key, value),

    get default() {
      return connectors.get(connections[defaultConnection].connector);
    },

    reloadDatabase: async () => {
      await Promise.all([...connectors.values()].map((connector) => connector.reloadDatabase()));
    },
  };
}

module.exports = createConnectorRegistry;
