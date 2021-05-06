const _ = require('lodash');
const path = require('path');

const { env: envf } = require('leemons-utils');
const { generateEnv } = require('leemons-utils/lib/env');
const { configProvider } = require('./configProvider');
const { loadFiles, loadFile } = require('./loadFiles');

const leemonsDefaultDirs = {
  config: envf('CONFIG_DIR', 'config'),
  models: 'models',
  plugins: 'plugins',
  next: envf('nextDir', 'next'),
  env: '.env',
};

async function loadConfiguration(
  object,
  { dir = process.cwd(), defaultDirs = leemonsDefaultDirs } = {}
) {
  // get config directory
  const configDir = path.resolve(dir, defaultDirs.config);

  // Read main config file
  const configFile =
    (await loadFile(path.join(configDir, 'config.json'))) ||
    (await loadFile(path.join(configDir, 'config.js')));

  let dirs;
  if (configFile && configFile.dir) {
    // Config directory can not be changed on config file
    dirs = { ...defaultDirs, ...configFile.dir, config: defaultDirs.config };
  } else {
    dirs = defaultDirs;
  }

  // Set the object paths (normally leemons or plugin)
  dirs.app = dir[dir.length - 1] === '/' ? dir : `${dir}/`;
  _.set(object, 'dir', dirs);

  if (!path.isAbsolute(dirs.env)) {
    dirs.env = path.join(dirs.app, dirs.env);
  }

  const env = await generateEnv(dirs.env);
  const config = {
    ...(await loadFiles(configDir, { env, exclude: ['config.json', 'config.js'] })),
  };
  if (configFile) {
    config.config = configFile;
  }

  return configProvider(config);
}

module.exports = {
  loadConfiguration,
};
