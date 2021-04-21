const Bookshelf = require('bookshelf');
const bookshelfUUID = require('bookshelf-uuid');

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

    this.buildQuery = buildQuery;
  }

  query(model) {
    return generateQueries(model, this);
  }

  async init(models) {
    // Get connections made with bookshelf
    const bookshelfConnections = Object.entries(this.leemons.config.get('database.connections'))
      .map(([name, value]) => ({ ...value, name }))
      .filter(({ connector }) => connector === 'bookshelf');

    // Initialize knex, all the connections in this.connections
    await initKnex(this, bookshelfConnections);

    return Promise.all(
      bookshelfConnections.map((connection) => {
        // TODO: Let the user have a pre-initialization function

        // Initialize the ORM
        const ORM = new Bookshelf(this.connections[connection.name]);

        // Use uuid plugin
        ORM.plugin(bookshelfUUID);

        const ctx = {
          ORM,
          connection,
          connector: this,
        };

        return setupConnection(ctx, models);
      })
    );
  }
}

module.exports = (leemons) => new Connector(leemons);
