const createConnectorRegistry = require('./connectorRegistry');

class DatabaseManager {
  constructor(leemons) {
    this.leemons = leemons;
    this.connectors = createConnectorRegistry(
      {
        connections: leemons.config.get('database.connections'),
        defaultConnection: leemons.config.get('database.defaultConnection'),
      },
      leemons
    );

    this.initialized = false;
  }

  async init() {
    if (this.initialized) throw new Error('The database was already initialized');

    this.connectors.load();
    await this.connectors.init();

    this.initialized = true;
  }
}

function createDatabaseManager(leemons) {
  return new DatabaseManager(leemons);
}

module.exports = { createDatabaseManager };
