module.exports = {
  ...leemons
    .getPlugin('common')
    .services.tags.getControllerFunctions(leemons.plugin.config.constants.pluginName),
};
