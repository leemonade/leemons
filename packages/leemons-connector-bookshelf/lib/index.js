const Bookshelf = require('bookshelf');
const _ = require('lodash');
const bookshelfUUID = require('bookshelf-uuid');

const { initKnex } = require('./knex');
const mountModels = require('./model/mountModel');
const generateQueries = require('./queries');

module.exports = (leemons) => {
  async function setupConnection(ctx) {
    // eslint-disable-next-line prettier/prettier
    const allModels = _.merge(
      {},
      leemons.global.models
    );

    const models = Object.values(allModels).filter(
      (model) => model.connection === ctx.connection.name
    );

    // give all the models to the ctx
    _.set(ctx, 'models', models);

    // First mount core_store for checking structure changes
    if (leemons.core_store.connection === ctx.connection.name) {
      await mountModels([leemons.core_store], ctx);
    }
    return mountModels(models, ctx);
  }

  function init() {
    // Get connections made with bookshelf
    const bookshelfConnections = Object.entries(leemons.config.get('database.connections'))
      .map(([name, value]) => ({ ...value, name }))
      .filter(({ connector }) => connector === 'bookshelf');

    // Initialize knex, all the connections in leemons.connections
    initKnex(leemons, bookshelfConnections);

    return Promise.all(
      bookshelfConnections.map((connection) => {
        // TODO: Let the user have a pre-initialization function

        // Initialize the ORM
        const ORM = new Bookshelf(leemons.connections[connection.name]);
        _.set(leemons.connections[connection.name], 'ORM', ORM);

        // Use uuid plugin
        ORM.plugin(bookshelfUUID);

        const ctx = {
          ORM,
          connection,
          leemons,
        };

        return setupConnection(ctx);
      })
    );
  }

  return {
    init,
    query: generateQueries,
  };
};
