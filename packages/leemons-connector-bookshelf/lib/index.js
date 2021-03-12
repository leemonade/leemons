const Bookshelf = require('bookshelf');
const _ = require('lodash');

const { initKnex } = require('./knex');
const mountModels = require('./model/mountModel');

module.exports = (leemons) => {
  function setupConnection(ctx) {
    // eslint-disable-next-line prettier/prettier
    const allModels = _.merge(
      {},
      { core_store: leemons.core_store },
      leemons.global.models
    );

    const models = Object.values(allModels).filter(
      (model) => model.connection === ctx.connection.name
    );
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
  };
};
