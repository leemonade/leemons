// const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

// TODO [!!!] Investigar si nos pueden llegar a llamar usando $node pasandose la seguridad
const ignoreNames = ['$node']; // 'deployment-manager', 'gateway'

function isCoreService(serviceName) {
  return false;
  // return ignoreNames.includes(getPluginNameFromServiceName(serviceName));
}

module.exports = { isCoreService };
