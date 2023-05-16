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
  providers: 'providers',
  // TODO: Add frontend dir for front dir
  // frontend: envf('frontendDir', 'frontend'),
  env: '.env',
};

async function loadConfiguration(
  object,
  { dir = process.cwd(), defaultDirs = leemonsDefaultDirs, useProcessEnv = false } = {}
) {
  const packageJSON = await loadFile(path.join(dir, 'package.json'));
  // Get config_dir from package.json
  if (_.has(packageJSON, 'leemons.configDir')) {
    _.set(defaultDirs, 'config', packageJSON.leemons.configDir);
  }
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

  const allDirs = Object.values(dirs).map((_dir) => path.resolve(dirs.app, _dir));
  if (allDirs.length > [...new Set(allDirs)].length) {
    throw new Error(
      `The specified directories in ${path.resolve(dirs.app, dirs.config)} must be different`
    );
  }

  const env = await generateEnv(dirs.env, useProcessEnv);
  const config = {
    ...(await loadFiles(configDir, { env, exclude: ['config.json', 'config.js'] })),
  };
  if (configFile) {
    config.config = configFile;
  }

  return { configProvider: configProvider(config), env };
}

module.exports = {
  loadConfiguration,
};
