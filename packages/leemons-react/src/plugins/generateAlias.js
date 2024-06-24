const path = require('path');
const fs = require('fs');

/* Global aliases */

// Generate alias object for webpack
module.exports = function generateAliases(dir, plugins) {
  const globalAliases = { '@leemons': dir };
  return plugins.reduce(
    (obj, plugin) => {
      const pluginPath = path.resolve(dir, 'plugins', plugin.name);
      const targetDir = fs.existsSync(path.join(pluginPath, 'dist')) ? 'dist' : 'src';

      return {
        ...obj,
        [`@${plugin.name.replace('-frontend-react-private', '').replace('-frontend-react', '')}`]:
          path.resolve(pluginPath, targetDir),
      };
    },
    { ...globalAliases }
  );
};
