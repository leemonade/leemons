const fs = require('fs-extra');
const path = require('path');
const { loadFile } = require('../config/loadFiles');

// Get an array of plugins stored under '/${pluginsFolder}'
async function getLocalProviders(leemons) {
  const dir = path.resolve(leemons.dir.app, leemons.dir.providers);
  const plugins = [];
  if (await fs.exists(dir)) {
    plugins.push(
      ...fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((plugin) => plugin.isDirectory())
        .map(({ name }) => ({ name, path: path.resolve(dir, name), source: 'local' }))
    );
  }
  return plugins;
}

// Get an array of plugins stored in node_modules
async function getExternalProviders(leemons) {
  const plugins = [];
  // eslint-disable-next-line import/no-dynamic-require, global-require
  // const packageJSON = require(path.resolve(leemons.dir.app, 'package.json'));
  const packageJSON = await loadFile(path.resolve(leemons.dir.app, 'package.json'));

  // Get the plugins from the app dependencies in package.json
  if (packageJSON.dependencies) {
    plugins.push(
      ...Object.keys(packageJSON.dependencies)
        .map((name) => {
          try {
            // Get those dependencies called 'leemons-plugin-*'
            if (name.startsWith('leemons-provider-')) {
              const pluginPath = path.dirname(require.resolve(`${name}/package.json`));
              return {
                name: name.replace('leemons-provider-', ''),
                path: pluginPath,
                source: 'external',
              };
            }
            return undefined;
          } catch (e) {
            return undefined;
          }
        })
        .filter((dependency) => dependency)
    );
  }
  return plugins;
}

module.exports = { getLocalProviders, getExternalProviders };
