const fs = require('fs');
const path = require('path');

/* Global aliases */

// Generate alias object for webpack
module.exports = function generateAliases(dir, plugins) {
  const globalAliases = { '@app': dir };
  return plugins.reduce(
    (obj, plugin) => {
      const pluginPath = path.resolve(dir, 'plugins', plugin.name);

      return {
        ...obj,
        [`@${plugin.name.replace('-frontend-react-private', '').replace('-frontend-react', '')}`]:
          path.resolve(pluginPath, 'src'),
      };
    },
    { ...globalAliases }
  );
};
