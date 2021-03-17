const Bookshelf = require('bookshelf');
const _ = require('lodash');
const bookshelfUUID = require('bookshelf-uuid');

const { initKnex } = require('./knex');
const mountModels = require('./model/mountModel');
const generateQueries = require('./queries');

class Connector {
  constructor(leemons) {
    this.leemons = leemons;
    this.models = new Map();
  }

  async setupConnection(ctx) {
    // eslint-disable-next-line prettier/prettier
      const allModels = _.merge(
        {},
        this.leemons.global.models
      );

    const models = Object.values(allModels).filter(
      (model) => model.connection === ctx.connection.name
    );

    // give all the models to the ctx
    _.set(ctx, 'models', models);

    // First mount core_store for checking structure changes
    if (this.leemons.core_store.connection === ctx.connection.name) {
      await mountModels([this.leemons.core_store], ctx);
    }
    return mountModels(models, ctx);
  }

  query(model) {
    return generateQueries(model, this);
  }

  init() {
    // Get connections made with bookshelf
    const bookshelfConnections = Object.entries(this.leemons.config.get('database.connections'))
      .map(([name, value]) => ({ ...value, name }))
      .filter(({ connector }) => connector === 'bookshelf');

    // Initialize knex, all the connections in leemons.connections
    initKnex(this.leemons, bookshelfConnections);

    return Promise.all(
      bookshelfConnections.map((connection) => {
        // TODO: Let the user have a pre-initialization function

        // Initialize the ORM
        const ORM = new Bookshelf(this.leemons.connections[connection.name]);
        _.set(this.leemons.connections[connection.name], 'ORM', ORM);

        // Use uuid plugin
        ORM.plugin(bookshelfUUID);

        const ctx = {
          ORM,
          connection,
          connector: this,
        };

        return this.setupConnection(ctx);
      })
    );
  }
}

module.exports = (leemons) => new Connector(leemons);
