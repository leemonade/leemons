function checkPluginDuplicates(plugins) {
  // for each plugin
  plugins.forEach((plugin) => {
    // compare it with each plugin
    plugins.forEach((_plugin) => {
      // to find duplicates (avoid comparation with itself)
      if (plugin !== _plugin && _plugin.name === plugin.name) {
        throw new Error(`A plugin named ${plugin.name} already exists in ${_plugin.dir.app}`);
      }
    });
  });
}

module.exports = checkPluginDuplicates;
