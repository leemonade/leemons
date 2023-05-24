function getAutoDeploymentIDIfCanIFNotThrowError(ctx) {
  if (process.env.DISABLE_AUTO_INIT !== 'true') {
    return 'auto-deployment-id';
  }
  throw new Error('No deploymentID found');
}

module.exports = { getAutoDeploymentIDIfCanIFNotThrowError };
