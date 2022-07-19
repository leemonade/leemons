const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = async function get({ app }) {
  try {
    const packageJSON = await fs.readJSON(path.resolve(app, 'package.json'));
    const plugins = [];

    if (packageJSON.dependencies) {
      plugins.push(
        ...Object.keys(packageJSON.dependencies)
          .map((name) => {
            try {
              // Get those dependencies called 'leemons-plugin-*'
              if (name.startsWith(`leemons-plugin-`) || name.startsWith(`leemons-provider-`)) {
                const pluginPath = path.dirname(require.resolve(`${name}/frontend/package.json`));
                const isPlugin = name.startsWith(`leemons-plugin-`);
                const prefix = isPlugin ? 'plugin' : 'provider';
                return {
                  name: name.replace(`leemons-${prefix}-`, ''),
                  path: pluginPath,
                };
              }
              return undefined;
            } catch (e) {
              return undefined;
            }
          })
          .filter(Boolean)
      );

      return plugins;
    }

    console.warn(chalk`{yellowBright Warning:} No plugins found in {bold ${app}}`);
    return [];
  } catch (e) {
    console.error(chalk`{redBright Error:} Cannot read package.json in {bold ${app}}`);
    throw e;
  }
};
