function getPluginNameFromServiceName(serviceName) {
  return serviceName.split('.')[0];
}

function getPluginNameFromCTX(ctx) {
  if (!ctx || !ctx.service || !ctx.service.name)
    throw new Error(
      '[leemons-service-name-parser - getPluginNameFromCTX] - ctx not a valid moleculer context'
    );
  return getPluginNameFromServiceName(ctx.service.name);
}

module.exports = {
  getPluginNameFromServiceName,
  getPluginNameFromCTX,
};
