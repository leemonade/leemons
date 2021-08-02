const PLUGIN_STATUS = {
  disabled: {
    code: 'disabled',
    reason: 'disabled by admin',
  },
  broken: {
    code: 'broken',
    reason: 'the plugin initialization failed',
  },
  missing: {
    code: 'missing',
    reason: 'the plugin is registered but its files are missing',
  },
  enabled: { code: 'enabled', reason: '' },
  duplicated: {
    code: 'duplicated',
    reason: 'the plugin is duplicated',
  },
  missingDeps: {
    code: 'missingDeps',
    reason: "some of the plugin' dependencies are not satisfied",
  },
  disabledDeps: {
    code: 'disabledDeps',
    reason: "some of the plugin' dependencies were disabled",
  },
  installationFailed: {
    code: 'broken',
    reason: 'the plugin installation failed',
  },
  servicesFailed: {
    code: 'broken',
    reason: 'the plugin services failed',
  },
  controllersFailed: {
    code: 'broken',
    reason: 'the plugin controllers failed',
  },
  initializationFailed: {
    code: 'broken',
    reason: 'the plugin initialization failed',
  },
  routesFailed: {
    code: 'broken',
    reason: 'the plugin routes loading failed',
  },
  eventsFailed: {
    code: 'broken',
    reason: 'the plugin events loading failed',
  },
};

// Get the status of the plugin based on the plugin info from DB
function getStatus(pluginInfo, defaultStatus) {
  if (pluginInfo.isDisabled) {
    return PLUGIN_STATUS.disabled;
  }
  if (pluginInfo.isBroken) {
    return PLUGIN_STATUS.broken;
  }

  return defaultStatus;
}

module.exports = {
  PLUGIN_STATUS,
  getStatus,
};
