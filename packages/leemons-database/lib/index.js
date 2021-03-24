const createConnectorRegistry = require('./connectorRegistry');
const queryBuilder = require('./queryBuilder');

class DatabaseManager {
  constructor(leemons) {
    this.leemons = leemons;
    this.defaultConnection = leemons.config.get('database.defaultConnection');
    this.connectors = createConnectorRegistry(
      {
        connections: leemons.config.get('database.connections'),
        defaultConnection: this.defaultConnection,
      },
      this
    );

    this.models = new Map();
    this.queries = new Map();

    this.initialized = false;
  }

  async init() {
    if (this.initialized) throw new Error('The database was already initialized');

    this.connectors.load();
    await this.connectors.init();

    this.initialized = true;
  }

  query(modelName) {
    // Get the used connector (if no connection provided, get the default one)
    // const connector = this.connectors.getFromConnection(connection);

    // Check if the model exists
    if (!modelName || !this.models.has(modelName)) {
      throw new Error(`The provided model can not be found: ${modelName}`);
    }

    // Check if the query builder is cached
    if (this.queries.has(modelName)) {
      return this.queries.get(modelName);
    }

    const model = this.models.get(modelName);
    const connector = this.connectors.getFromConnection(model.connection);

    const query = queryBuilder(model, connector);
    this.queries.set(modelName, query);
    return query;
  }
}

function createDatabaseManager(leemons) {
  return new DatabaseManager(leemons);
}

module.exports = { createDatabaseManager };
