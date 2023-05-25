const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

const ignoreNames = ['$node', 'deployment-manager', 'gateway'];

function isCoreService(serviceName) {
  return ignoreNames.includes(getPluginNameFromServiceName(serviceName));
}

module.exports = { isCoreService };
