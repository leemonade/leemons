const {
  getAutoDeploymentIDIfCanIFNotThrowError,
} = require('./getAutoDeploymentIDIfCanIFNotThrowError');

function getDeploymentIDFromCTX(ctx) {
  if (ctx.meta.deploymentID) return ctx.meta.deploymentID;
  if (ctx.meta.userSession?.deploymentID) return ctx.meta.userSession.deploymentID;
  return getAutoDeploymentIDIfCanIFNotThrowError(ctx);
}

module.exports = { getDeploymentIDFromCTX };
