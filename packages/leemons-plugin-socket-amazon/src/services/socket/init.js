const { getClientCached } = require('./awsClient');

module.exports = async function init() {
  // Vamos cargando el cliente iot de backend
  getClientCached();
};
