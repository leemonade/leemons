const _ = require('lodash');
const path = require('path');

const { env } = require('leemons-utils');
const { configProvider } = require('./configProvider');
const { loadFiles } = require('./loadFiles');

let defaultDirs = {
  config: env('CONFIG_DIR', 'config'),
  model: 'models',
};

function loadConfiguration(leemons) {
  // get the default directory
  const dir = process.cwd();

  // get config directory
  const configDir = path.resolve(dir, defaultDirs.config);
  const config = {
    ...loadFiles(configDir),
  };

  if (config.config.dir) {
    // Config directory can not be changed on config file
    defaultDirs = { ...defaultDirs, ...config.config.dir, config: defaultDirs.config };
  }
  // Set the leemons app path
  defaultDirs.app = dir;
  _.set(leemons, 'dir', defaultDirs);

  return configProvider(config);
}

module.exports = {
  loadConfiguration,
};
