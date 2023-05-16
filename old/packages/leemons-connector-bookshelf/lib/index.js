const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');
const _ = require('lodash');
const fs = require('fs/promises');

const { initKnex } = require('./knex');
const mountModels = require('./model/mountModel');
const generateQueries = require('./queries/queries');
const buildQuery = require('./queries/buildQuery');

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
        const { connection: ORMConnection, config } = this.connections[connection.name];
        // Initialize the ORM
        const ORM = new Bookshelf(ORMConnection);

        // Use uuid plugin
        ORM.plugin(bookshelfUUID);

        const ctx = {
          ORM,
          connection,
          connector: this,
          config,
        };
        this.contexts.set(connection.name, ctx);

        return ctx;
      })
    );
  }

  destroy() {
    return Promise.all(
      Object.values(this.connections).map((connection) => {
        try {
          return connection.destroy();
        } catch (e) {
          return null;
        }
      })
    );
  }

  /**
   * Loads the given models in the database
   * @param {Model[]} models
   * @returns {Promise}
   */
  async loadModels(models) {
    // Separate the models per connection
    const modelsPerConnection = _.groupBy(models, 'connection');

    // Load models per connection
    return Promise.all(
      Object.entries(modelsPerConnection).map(([connection, _models]) => {
        // Get the ctx for the given connection
        const ctx = this.contexts.get(connection);
        // Mount the models
        return mountModels(_models, ctx);
      })
    );
  }

  async reloadDatabase() {
    try {
      const contexts = [...this.contexts.values()];
      return await Promise.all(
        contexts.map(async (ctx) => {
          const restoreFile = await (
            await fs.readFile(ctx.connection.restoreFile, 'utf8')
          ).toString();

          const { ORM } = ctx;

          this.leemons.log.silly(
            `Restoring database ${ctx.connection.database} on connection ${ctx.connection.name}`
          );
          await ORM.knex.raw(restoreFile);
          this.leemons.log.silly(
            `Restored database ${ctx.connection.database} on connection ${ctx.connection.name}`
          );
          return true;
        })
      );
    } catch (e) {
      this.leemons.log.error(e.message);
      throw e;
    }
  }
}

module.exports = (leemons) => new Connector(leemons);
