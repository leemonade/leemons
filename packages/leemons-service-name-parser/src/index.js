function getActionWithOutVersion(actionName) {
  const sp = actionName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    sp.shift();
    return sp.join('.');
  }
  return actionName;
}

function getPluginNameFromServiceName(serviceName) {
  const sp = serviceName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    return sp[1];
  }
  return sp[0];
}

function getPluginNameFromCTX(ctx) {
  if (!ctx || !ctx.service || !ctx.service.name)
    throw new Error(
      '[leemons-service-name-parser - getPluginNameFromCTX] - ctx not a valid moleculer context'
    );
  return getPluginNameFromServiceName(ctx.service.name);
}

function getActionNameFromCTX(ctx) {
  if (!ctx || !ctx.service || !ctx.service.fullName || !ctx.action || !ctx.action.name)
    throw new Error(
      '[leemons-service-name-parser - getActionNameFromCTX] - ctx not a valid moleculer context'
    );
  return ctx.action.name.replace(`${ctx.service.fullName}.`, '');
}

module.exports = {
  getActionWithOutVersion,
  getPluginNameFromServiceName,
  getPluginNameFromCTX,
  getActionNameFromCTX,
};
