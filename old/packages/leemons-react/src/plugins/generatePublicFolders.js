const path = require('path');

// Generate public folders list for webpack config
module.exports = function generatePublicFolders(dir, plugins) {
  return plugins
    .filter(({ public: hasPublic }) => hasPublic)
    .map(({ name }) => ({
      from: path.resolve(dir, 'plugins', name, 'public'),
      to: path.join('public', name),
      noErrorOnMissing: true,
    }));
};
