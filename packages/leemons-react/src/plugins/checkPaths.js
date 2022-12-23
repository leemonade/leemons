const path = require('path');
const { fileExists, folderExists } = require('../fs');

module.exports = async function checkPaths({ plugin }) {
  if (Array.isArray(plugin)) {
    return Promise.all(plugin.map((p) => checkPaths({ plugin: p })));
  }

  return {
    ...plugin,
    routers: {
      public: await fileExists(path.resolve(plugin.path, 'Public.js')),
      private: await fileExists(path.resolve(plugin.path, 'Private.js')),
    },
    public: await folderExists(path.resolve(plugin.path, 'public')),
    hooks: await fileExists(path.resolve(plugin.path, 'globalHooks.js')),
    globalContext: await fileExists(path.resolve(plugin.path, 'globalContext.js')),
    localContext: await fileExists(path.resolve(plugin.path, 'localContext.js')),
  };
};
