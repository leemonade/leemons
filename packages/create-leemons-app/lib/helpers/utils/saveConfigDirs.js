const path = require('path');
const createFile = require('./createFile');

// TODO: Add more comments

module.exports = (dir, config) => {
  const configDir = path.join(dir, config.routes.values.config, 'config.js');

  const { config: _configRoute, ...routes } = config.routes.values;

  // config.js
  const configFileContent = `\
module.exports = {
  dir: {
    ${Object.entries(routes)
      .map(([key, value]) => `${key}: '${value}'`)
      .join(',\n    ')},
  }
};`;

  createFile(configDir, configFileContent, 'config.js');
};
