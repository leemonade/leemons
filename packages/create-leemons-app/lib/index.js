const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

const { version } = require('../package.json');

const form = require('./form');
const hasAccess = require('./helpers/utils/fsPermissions');
const isFolderEmpty = require('./helpers/validators/isFolderEmpty');
const validateName = require('./helpers/validators/packageName');
const shouldUseYarn = require('./helpers/packageManager/shouldUseYarn');
const installDeps = require('./helpers/packageManager/installDeps');
const getDatabaseConfig = require('./helpers/utils/getDatabaseConfig');
const exitWithError = require('./helpers/utils/exitWithError');
const saveConfigDirs = require('./helpers/utils/saveConfigDirs');
const getDatabaseDeps = require('./helpers/packageManager/getDatabaseDeps');
const createDir = require('./helpers/utils/createDir');
const createPackageJSON = require('./createPackageJSON');

module.exports = async (_appName, useNPM) => {
  try {
    const cwd = process.cwd();

    // Get app settings
    let userConfig = { _appName, ...(await form(_appName)) };

    // Fill required but user-optional info
    userConfig = _.defaultsDeep(userConfig, {
      routes: {
        values: {
          app: path.join(cwd, userConfig.appName),
          config: 'config',
          plugins: 'plugins',
          frontend: 'frontend',
          env: '.env',
        },
      },
    });

    const {
      appName,
      routes: { values: routes },
    } = userConfig;

    // Validate app name
    if (!validateName(appName)) {
      exitWithError(chalk`{red The name {bold ${appName}} is not valid}`);
    }

    // Throw error when app folder is not empty
    if (!(await isFolderEmpty(routes.app))) {
      exitWithError(chalk`{red The directory {bold ${routes.app}} is not empty}`);
    }

    // Throw if we don't have permissions
    if (!(await hasAccess(cwd, ['r', 'w', 'x']))) {
      exitWithError(
        chalk`{red The directory {bold ${cwd}} does not have read, write and execute permissions}`
      );
    }

    // Decide to use npm or yarn
    const useYarn = useNPM || (await shouldUseYarn());

    // Create the app dir
    await createDir(routes.app, appName);

    // run simultaneous
    await Promise.all([
      createPackageJSON(appName, routes).then(async () => {
        // Install the app's dependencies
        const dependencies = [`leemons@${version}`, ...getDatabaseDeps(userConfig)];
        if (!(await installDeps(routes.app, dependencies, useYarn))) {
          exitWithError('An error occurred while installing the dependencies');
        }
      }),

      // Create plugins dir
      createDir(path.join(routes.app, routes.plugins), 'plugins'),

      // Create config dir
      createDir(path.join(routes.app, routes.config), 'config').then(async () =>
        Promise.all([
          // Save config.js
          saveConfigDirs(routes.app, userConfig),
          // Save database.js
          getDatabaseConfig(routes.app, userConfig),
        ])
      ),
    ]);
  } catch (e) {
    exitWithError('An unknown error occurred while creating the app');
  }
};
