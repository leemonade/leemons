const _ = require('lodash');
const path = require('path');

const { env } = require('leemons-utils');
const { configProvider } = require('./configProvider');
const { loadFiles } = require('./loadFiles');

const leemonsDefaultDirs = {
  config: env('CONFIG_DIR', 'config'),
  models: 'models',
  plugins: 'plugins',
  next: env('nextDir', 'next'),
};

function loadConfiguration(object, dir = process.cwd(), defaultDirs = leemonsDefaultDirs) {
  // get config directory
  const configDir = path.resolve(dir, defaultDirs.config);
  const config = {
    ...loadFiles(configDir),
  };

  let dirs;
  if (config.config && config.config.dir) {
    // Config directory can not be changed on config file
    dirs = { ...defaultDirs, ...config.config.dir, config: defaultDirs.config };
  } else {
    dirs = defaultDirs;
  }
  // Set the object paths (normally leemons or plugin)
  dirs.app = dir[dir.length - 1] === '/' ? dir : `${dir}/`;
  _.set(object, 'dir', dirs);

  return configProvider(config);
}

module.exports = {
  loadConfiguration,
};
