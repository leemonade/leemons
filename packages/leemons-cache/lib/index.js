const connectorLoader = require('./connectorLoader');

class CacheManager {
  constructor({ leemons }) {
    this.leemons = leemons;
    this.connection = this.leemons.config.get('cache.connection', {});
  }

  async init() {
    this.cache = await connectorLoader({ connection: this.connection });

    return this.cache({ config: this.connection, leemons: this.leemons });
  }
}

module.exports = CacheManager;
