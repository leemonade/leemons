const _ = require('lodash');

const createConnectorRegistry = require('./connectorRegistry');
const queryBuilder = require('./queryBuilder');

class DatabaseManager {
  constructor(leemons) {
    this.leemons = leemons;
    this.defaultConnection = leemons.config.get('database.defaultConnection', null);

    this.connectors = createConnectorRegistry(
      {
        // FIXME: If no database config provided, it will crash
        connections: leemons.config.get('database.connections', null),
        defaultConnection: this.defaultConnection,
      },
      this
    );

    this.models = new Map();

    // Register the queries (only show it to leemons-database)
    this.queries = new Map();

    this.initialized = false;
  }

  async init() {
    if (this.initialized) throw new Error('The database was already initialized');

    await this.connectors.load();
    await this.connectors.init();

    this.initialized = true;
  }

  async loadModels(models) {
    await this.connectors.loadModels(this.leemons.models.core_store, models);
  }

  async destroy() {
    await this.connectors.destroy();
  }

  query(modelName, pluginName = null) {
    // FIXME: An error will throw if the plugin or model can't be found
    // TODO: Add plugin roles

    let showDelete = true;
    if (pluginName) {
      const plugin = _.get(this.leemons, modelName.split('::')[0].replace(/_/g, '.'), null);
      // TODO: Plugins permissions
      if (
        !plugin ||
        (plugin.config.get('config.private', false) === true && plugin.name !== pluginName)
      ) {
        // The provided model is private and not visible for you
        throw new Error(`The provided model can not be found: ${modelName}`);
      }

      if (plugin.name !== pluginName) {
        showDelete = false;
      }
    }

    if (!modelName || !this.models.has(modelName)) {
      // The provided model does not exist
      throw new Error(`The provided model can not be found: ${modelName}`);
    }

    // Check if the query builder is cached
    if (this.queries.has(modelName)) {
      return showDelete
        ? this.queries.get(modelName)
        : _.omit(this.queries.get(modelName), ['delete', 'deleteMany']);
    }

    const model = this.models.get(modelName);
    const connector = this.connectors.getFromConnection(model.connection);

    const query = queryBuilder(model, connector);
    this.queries.set(modelName, query);
    return showDelete ? query : _.omit(query, ['delete', 'deleteMany']);
  }

  reloadDatabase() {
    return this.connectors.reloadDatabase();
  }
}

function createDatabaseManager(leemons) {
  return new DatabaseManager(leemons);
}

module.exports = { createDatabaseManager };
