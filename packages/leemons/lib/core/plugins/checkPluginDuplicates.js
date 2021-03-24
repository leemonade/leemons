function checkPluginDuplicates(plugins) {
  plugins.forEach((plugin) => {
    plugins.forEach((_plugin) => {
      if (plugin !== _plugin && _plugin.name === plugin.name) {
        throw new Error(`A plugin named ${plugin.name} already exists in ${_plugin.dir.app}`);
      }
    });
  });
}

module.exports = checkPluginDuplicates;
