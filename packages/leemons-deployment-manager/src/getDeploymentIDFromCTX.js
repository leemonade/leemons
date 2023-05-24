const {
  getAutoDeploymentIDIfCanIFNotThrowError,
} = require('./getAutoDeploymentIDIfCanIFNotThrowError');

function getDeploymentIDFromCTX(ctx) {
  if (ctx.meta.deploymentID) return ctx.meta.deploymentID;
  // TODO EXTRAER EL DEPLOYMENTID DE LA SESSION DEL USUARIO CUANDO EXISTA
  return getAutoDeploymentIDIfCanIFNotThrowError();
}

module.exports = { getDeploymentIDFromCTX };
