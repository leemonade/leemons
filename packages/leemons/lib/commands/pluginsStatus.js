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
