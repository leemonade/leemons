const { LeemonsError } = require('@leemons/error');

function getAutoDeploymentIDIfCanIFNotThrowError(ctx) {
  if (process.env.DISABLE_AUTO_INIT !== 'true') {
    return process.env.AUTO_INIT_DEPLOYMENT_ID ?? 'auto-deployment-id';
  }
  throw new LeemonsError(ctx, { message: 'No deploymentID found' });
}

module.exports = { getAutoDeploymentIDIfCanIFNotThrowError };
