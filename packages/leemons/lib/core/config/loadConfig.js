const path = require('path');

const { env } = require('leemons-utils');
const { configProvider } = require('./configProvider');
const { loadFiles } = require('./loadFiles');

const defaultDirs = {
  config: 'config',
};

function loadConfiguration(leemons) {
  // get the default directory
  const dir = process.cwd();
  // get config directory
  const configDir = path.resolve(dir, env('CONFIG_DIR', defaultDirs.config));
  const config = {
    ...loadFiles(configDir),
  };

  leemons.log(configDir);
  return configProvider(config);
}

module.exports = {
  loadConfiguration,
};
