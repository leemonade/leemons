const ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK = [
  'deployment-manager.reloadAllDeploymentsRest',
  'deployment-manager.addManualDeploymentRest',
  'deployment-manager.addPluginsToDeploymentRest',
  'gateway.dropDBRest',
  'gateway.statusRest',
  'v1.client-manager.protected.newDeployment',
  'v1.client-manager.protected.isSubdomainInUse',
  'v1.users-cognito.emails.getEmail',
];

const EVENT_TYPES = {
  ONCE_PER_INSTALL: 'once-per-install',
  ONCE: 'once',
};

module.exports = {
  ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK,
  EVENT_TYPES,
};
