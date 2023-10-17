function generateLRN({ partition, pluginName, region, deploymentID, modelName, resourceID }) {
  return `lrn:${partition}:${pluginName}:${region}:${deploymentID}:${modelName}:${resourceID}`;
}
function isLRN(str) {
  return /^lrn:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$/.test(str);
}
function parseLRN(lrn) {
  const [, partition, pluginName, region, deploymentID, modelName, resourceID] = lrn.split(':');

  return {
    partition,
    pluginName,
    region,
    deploymentID,
    modelName,
    resourceID,
  };
}

module.exports = {
  generateLRN,
  parseLRN,
  isLRN,
};
