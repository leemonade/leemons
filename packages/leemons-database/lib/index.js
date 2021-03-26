const { getStackTrace } = require('leemons-utils');
const _ = require('lodash');
const path = require('path');

const createConnectorRegistry = require('./connectorRegistry');
const queryBuilder = require('./queryBuilder');

class DatabaseManager {
  constructor(leemons) {
    this.leemons = leemons;
    this.defaultConnection = leemons.config.get('database.defaultConnection');

    // Register the models (only show it to leemons-database)
    const leemonsDatabasePath = path.dirname(require.resolve('leemons-database/package.json'));
    const leemonsPath = path.dirname(require.resolve('leemons/package.json'));

    const connectors = createConnectorRegistry(
      {
        connections: leemons.config.get('database.connections'),
        defaultConnection: this.defaultConnection,
      },
      this
    );

    Object.defineProperty(this, 'connectors', {
      get: () => {
        const caller = getStackTrace(2).fileName;
        if (
          [leemonsPath, leemonsDatabasePath].find((allowedPath) => caller.includes(allowedPath))
        ) {
          return connectors;
        }
        return null;
      },
    });

    const models = new Map();
    Object.defineProperty(this, 'models', {
      get: () => {
        const caller = getStackTrace(2).fileName;
        if (
          [leemonsPath, leemonsDatabasePath].find((allowedPath) => caller.includes(allowedPath))
        ) {
          return models;
        }
        return null;
      },
    });

    // Register the queries (only show it to leemons-database)
    const queries = new Map();
    this.queries = new Map();
    Object.defineProperty(this, 'queries', {
      get: () => {
        const caller = getStackTrace(2).fileName;
        if (caller.includes(leemonsDatabasePath)) {
          return queries;
        }
        return null;
      },
    });

    this.initialized = false;
  }

  async init() {
    if (this.initialized) throw new Error('The database was already initialized');

    this.connectors.load();
    await this.connectors.init(
      this.leemons.core_store,
      _.merge(
        ...Object.values(this.leemons.plugins)
          .filter((plugin) => plugin.models)
          .map((plugin) => plugin.models)
      )
    );

    this.initialized = true;
  }

  query(modelName) {
    // TODO: Private models (can be accessed through the ORM (the ORM is exposed per plugin))
    // TODO: Limit database deletion
    // TODO: Add plugin roles

    // Get the used connector (if no connection provided, get the default one)
    // const connector = this.connectors.getFromConnection(connection);

    if (modelName.split('_')[0] === 'plugins') {
      const caller = getStackTrace(3).fileName;
      const plugin = _.get(this.leemons, modelName.split('::')[0].replace(/_/g, '.'));

      const leemonsPath = path.dirname(require.resolve('leemons/package.json'));
      const leemonsDatabasePath = path.dirname(require.resolve('leemons-database/package.json'));

      if (
        plugin &&
        _.get(plugin.config, 'config.private', false) &&
        ![plugin.dir.app, leemonsPath, leemonsDatabasePath].find((allowedPath) =>
          caller.includes(allowedPath)
        )
      ) {
        // The provided model is private and not visible for you
        throw new Error(`The provided model can not be found: ${modelName}`);
      }
    }
    if (!modelName || !this.models.has(modelName)) {
      // Check if the model exists
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
