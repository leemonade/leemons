class QueriesBase {
  /**
   *
   * @param {Object} param0
   * @param {import('ioredis').Redis} param0.client
   * @param {boolean} param0.isCluster
   * @param {string} param0.pluginName
   */
  constructor({ client, isCluster, pluginName }) {
    this.client = client;
    this.isCluster = isCluster;

    this.pluginName = pluginName;
  }

  generateKey({ key }) {
    return `{plugin.${this.pluginName}}.${key}`;
  }

  cleanKey({ key }) {
    return key.replace(new RegExp(`^\\{plugin\\.${this.pluginName}\\}\\.`), '');
  }
}

module.exports = QueriesBase;
