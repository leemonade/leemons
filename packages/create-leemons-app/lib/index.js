const path = require('path');
const fs = require('fs-extra');
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

module.exports = async (_appName, useNPM) => {
  try {
    const template = 'default';
    const cwd = process.cwd();

    let userConfig = { _appName, ...(await form(_appName)) };

    userConfig = _.defaultsDeep(userConfig, {
      routes: {
        values: {
          app: path.join(cwd, userConfig.appName),
          config: 'config',
          plugins: 'plugins',
          next: 'next',
          env: '.env',
        },
      },
    });

    const {
      appName,
      routes: { values: routes },
    } = userConfig;
    if (!validateName(appName)) {
      exitWithError(chalk`{red The name {bold ${appName}} is not valid}`);
    }

    if (!(await isFolderEmpty(routes.app))) {
      exitWithError(chalk`{red The directory {bold ${routes.app}} is not empty}`);
    }

    if (!(await hasAccess(cwd, ['r', 'w', 'x']))) {
      exitWithError(
        chalk`{red The directory {bold ${cwd}} does not have read, write and execute permissions}`
      );
    }

    const useYarn = useNPM || (await shouldUseYarn());

    try {
      await fs.mkdir(routes.app, { recursive: true });
    } catch (e) {
      exitWithError(chalk`{red An error occurred while creating the {bold {dir}} directory}`);
    }

    try {
      const packageJSON = {
        name: appName,
        version: '1.0.0',
        private: true,
        scripts: {
          start: 'leemons start',
          dev: 'leemons dev',
          leemons: 'leemons',
        },
        leemons: {},
      };

      if (routes.config !== 'config') {
        packageJSON.leemons.configDir = routes.config;
      }

      await fs.writeFile(
        path.join(routes.app, 'package.json'),
        `${JSON.stringify(packageJSON, '', 2)}\n`
      );
    } catch (e) {
      exitWithError(chalk`{red An error occurred while creating {bold package.json}}`);
    }

    const dependencies = [`leemons@${version}`, ...getDatabaseDeps(userConfig)];
    if (!(await installDeps(routes.app, dependencies, useYarn))) {
      exitWithError('An error occurred while installing the dependencies');
    }

    const localFrontDir = path.join(__dirname, 'templates', template, 'front');
    const frontDir = path.join(routes.app, routes.next);
    try {
      await fs.copy(localFrontDir, frontDir);
    } catch (e) {
      exitWithError('An error occurred while generating the frontend directories');
    }

    const pluginsDir = path.join(routes.app, routes.plugins);
    try {
      await fs.mkdir(pluginsDir);
    } catch (e) {
      exitWithError('An error occurred while creating the plugins folder');
    }

    const configDir = path.join(routes.app, routes.config);
    try {
      await fs.mkdir(configDir);
    } catch (e) {
      exitWithError('An error occurred while creating the config folder');
    }
    await saveConfigDirs(routes.app, userConfig);
    await getDatabaseConfig(routes.app, userConfig);
  } catch (e) {
    exitWithError('An unknown error occurred while creating the app');
  }
};
