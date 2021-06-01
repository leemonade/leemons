const path = require('path');
const fs = require('fs-extra');
const { command } = require('execa');
const chalk = require('chalk');
const _ = require('lodash');

const { version } = require('../package.json');

const form = require('./form');
const hasAccess = require('./helpers/utils/fsPermissions');
const isFolderEmpty = require('./helpers/validators/isFolderEmpty');
const validateName = require('./helpers/validators/packageName');
const shouldUseYarn = require('./helpers/packageManager/shouldUseYarn');

module.exports = async (appName) => {
  try {
    const cwd = process.cwd();

    const userConfig = { appName }; // ...(await form(appName)) };

    console.log(userConfig);
    {
      const { appName } = userConfig;
      if (!validateName(appName)) {
        console.error(chalk`{red The name {bold ${appName}} is not valid}`);
        process.exit(1);
      }

      const dir = path.join(cwd, appName);
      if (!(await isFolderEmpty(dir))) {
        console.error(chalk`{red The directory {bold ${dir}} is not empty}`);
        process.exit(1);
      }

      if (!(await hasAccess(cwd, ['r', 'w', 'x']))) {
        console.error(
          chalk`{red The directory {bold ${cwd}} does not have read, write and execute permissions}`
        );
        process.exit(1);
      }

      const useYarn = await shouldUseYarn();

      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (e) {
        console.error(chalk`{red An error occurred while creating the {bold {dir}} directory}`);
        process.exit(1);
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
        };
        await fs.writeFile(
          path.join(dir, 'package.json'),
          `${JSON.stringify(packageJSON, '', 2)}\n`
        );
      } catch (e) {
        console.error(chalk`{red An error occurred while creating {bold package.json}}`);
        process.exit(1);
      }

      try {
        const dependencies = [`leemons@${version}`];
        await command(`yarn --cwd ${dir} add ${dependencies.join(' ')}`, {
          stdio: 'inherit',
        });
      } catch (e) {
        process.exit(1);
      }
      /**
       * El nombre es válido?
       * Existe ya la carpeta
       * Tenemos permisos
       * Usamos yarn o npm
       * crear carpeta
       *  crear package.json
       *    instalar deps
       *  Crear carpeta de front
       *  Crear carpeta de plugins
       *  Crear .env
       */
      // if (await hasAccess(cwd, ['r', 'w', 'x'])) {
      //   console.log('Everything ok');
      //   await fs.mkdir(dir);
      //   const packageJSON = {
      //     name: appName,
      //     version: '1.0.0',
      //     private: true,
      //     scripts: {
      //       start: 'leemons start',
      //       dev: 'leemons dev',
      //       leemons: 'leemons',
      //     },
      //   };
      //   await fs.writeFile(
      //     path.join(dir, 'package.json'),
      //     `${JSON.stringify(packageJSON, '', 2)}\n`
      //   );

      //   const dependencies = [`leemons@${version}`];

      //   await command(`yarn --cwd ${dir} add ${dependencies.join(' ')}`, {
      //     stdio: 'inherit',
      //   });

      //   fs.mkdir(path.join(dir, 'config'));
      // } else {
      //   console.log('No access!!');
      // }
    }
    // console.log(data);
  } catch (e) {
    console.log(e);
  }
};
