const initMongooseConnections = require('./mongoose');

class Connector {
  constructor(leemons) {
    this.leemons = leemons;
    this.models = new Map();
    this.contexts = new Map();

    // this.buildQuery = buildQuery;
  }

  // query(model) {
  //   return generateQueries(model, this);
  // }

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
          ORM: connection,
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
  }
}

module.exports = (leemons) => new Connector(leemons);
