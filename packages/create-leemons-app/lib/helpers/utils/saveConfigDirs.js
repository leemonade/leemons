const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const exitWithError = require('./exitWithError');

function createFile(dir, content, filename) {
  try {
    return fs.writeFile(dir, content);
  } catch (e) {
    return exitWithError(chalk`{red The ${filename} file can not be created}`);
  }
}

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
