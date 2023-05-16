const path = require('path');

/* Global aliases */

// Generate alias object for webpack
module.exports = function generateAliases(dir, plugins) {
  const globalAliases = { '@leemons': dir };
  return plugins.reduce(
    (obj, plugin) => ({
      ...obj,
      [`@${plugin.name}`]: path.resolve(dir, 'plugins', plugin.name, 'src'),
    }),
    { ...globalAliases }
  );
};
