const fs = require('fs');
const path = require('path');

/* Global aliases */

// Generate alias object for webpack
module.exports = function generateAliases(dir, plugins) {
  const globalAliases = { '@app': dir };
  return plugins.reduce(
    (obj, plugin) => {
      const pluginPath = path.resolve(dir, 'plugins', plugin.name);
      let targetDir = 'src';

      // If the plugin is a backend plugin, we need to point to the dist folder
      if (!plugin.name.includes('frontend') && fs.existsSync(path.join(pluginPath, 'dist'))) {
        targetDir = 'dist';
      }

      return {
        ...obj,
        [`@${plugin.name.replace('-frontend-react-private', '').replace('-frontend-react', '')}`]:
          path.resolve(pluginPath, targetDir),
      };
    },
    { ...globalAliases }
  );
};
