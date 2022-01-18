const _ = require('lodash');
const loadSchemas = require('./model/loadSchemas');
const mountModels = require('./model/mountModels');
const initMongooseConnections = require('./mongoose');
const generateQueries = require('./queries/queries');

class Connector {
  constructor(leemons) {
    this.leemons = leemons;
    this.models = new Map();
    this.contexts = new Map();

    // this.buildQuery = buildQuery;
  }

  query(model) {
    return generateQueries(model, this);
  }

  async init() {
    // Get connections made with mongoose
    const mongooseConnections = Object.entries(this.leemons.config.get('database.connections'))
      .map(([name, value]) => ({ ...value, name }))
      .filter(({ connector }) => connector === 'mongoose');

    // Create a new mongoose connection for each connection
    await initMongooseConnections(this, mongooseConnections);

    return Promise.all(
      mongooseConnections.map((connection) => {
        const ctx = {
          ODM: this.connections[connection.name],
          schemas: new Map(),
          connection,
          connector: this,
        };

        this.contexts.set(connection.name, ctx);

        return ctx;
      })
    );
  }

  destroy() {
    return Promise.all(Object.values(this.connections).map((connection) => connection.close()));
  }

  /**
   * Loads the given models in the database
   * @param {Array<Model>} models
   * @returns {Promise<void>}
   */
  async loadModels(models) {
    const modelsPerConnection = _.groupBy(models, 'connection');

    return Promise.all(
      Object.entries(modelsPerConnection).map(async ([connection, _models]) => {
        const { collection: collections = [], schema: schemas = [] } = _.groupBy(_models, 'type');
        const ctx = this.contexts.get(connection);

        if (collections.length) {
          // Do not create schemas if they are not going to be used
          if (schemas.length) {
            loadSchemas(ctx, schemas);
          }

          return mountModels(collections, ctx);
        }
        return null;
      })
    );
  }
}

module.exports = (leemons) => new Connector(leemons);
