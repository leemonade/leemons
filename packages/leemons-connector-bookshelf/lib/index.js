const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');
const _ = require('lodash');

const { initKnex } = require('./knex');
const mountModels = require('./model/mountModel');
const generateQueries = require('./queries/queries');
const buildQuery = require('./queries/buildQuery');

async function setupConnection(ctx, allModels) {
  const models = Object.values(allModels).filter(
    (model) => model.connection === ctx.connection.name
  );

  // First mount core_store for checking structure changes
  return mountModels(models, ctx);
}

class Connector {
  constructor(leemons) {
    this.leemons = leemons;
    this.models = new Map();
    this.contexts = new Map();

    this.buildQuery = buildQuery;
  }

  query(model) {
    return generateQueries(model, this);
  }

  async init() {
    // Get connections made with bookshelf
    const bookshelfConnections = Object.entries(this.leemons.config.get('database.connections'))
      .map(([name, value]) => ({ ...value, name }))
      .filter(({ connector }) => connector === 'bookshelf');

    // Initialize knex, all the connections in this.connections
    await initKnex(this, bookshelfConnections);

    return Promise.all(
      bookshelfConnections.map((connection) => {
        // Initialize the ORM
        const ORM = new Bookshelf(this.connections[connection.name]);

        // Use uuid plugin
        ORM.plugin(bookshelfUUID);

        const ctx = {
          ORM,
          connection,
          connector: this,
        };
        this.contexts.set(connection.name, ctx);

        return ctx;
      })
    );
  }

  destroy() {
    return Promise.all(Object.values(this.connections).map((connection) => connection.destroy()));
  }

  /**
   * Loads the given models in the database
   * @param {Model[]} models
   * @returns {Promise}
   */
  async loadModels(models) {
    const modelsPerConnection = {};
    // Separate the models per connection
    Object.values(models).forEach((model) => {
      if (_.has(modelsPerConnection, model.connection)) {
        modelsPerConnection[model.connection].push(model);
      } else {
        modelsPerConnection[model.connection] = [model];
      }
    });

    // Load models per connection
    return Promise.all(
      Object.entries(modelsPerConnection).map(([connection, _models]) => {
        // Throw if the connection does not exists
        if (!this.contexts.has(connection)) {
          throw new Error(
            `No connection called ${connection} was setted up for connector: Bookshelf`
          );
        }

        // Get the ctx for the given connection
        const ctx = this.contexts.get(connection);
        // Mount the models
        return mountModels(_models, ctx);
      })
    );
  }
}

module.exports = (leemons) => new Connector(leemons);
