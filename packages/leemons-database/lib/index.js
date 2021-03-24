const _ = require('lodash');

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

  // This is done for making connector development easier
  exposeModels() {
    this.leemons.models = _.merge(
      ...Object.values(this.leemons.plugins)
        .filter((plugin) => plugin.models)
        .map((plugin) => plugin.models)
    );
  }

  // This is done for ram efficiency
  undoModelExposure() {
    delete this.leemons.models;
  }

  async init() {
    if (this.initialized) throw new Error('The database was already initialized');

    this.connectors.load();
    // expose models under leemons.models for the connectors.
    this.exposeModels();
    await this.connectors.init();
    this.undoModelExposure();

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
