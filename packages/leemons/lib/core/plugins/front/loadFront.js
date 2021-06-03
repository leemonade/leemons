/* eslint-disable no-param-reassign */

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const readdirRecursive = require('leemons-utils/lib/readdirRecursive');
const execa = require('execa');
const { copyFolder } = require('./copyFolder');
const { generatePluginLoader } = require('./pluginLoader');
const copyPackageJSON = require('./copyPackageJSON');

/**
 * Checks if the directory have been changed since last execution
 *
 * If the directory doesn't exists, it creates it
 *
 * The directory integrity is checked through checksums.json
 *
 * @param {string} dir The directory to look for changes
 * @returns
 */
async function checkDirChanges(dir) {
  // If directory does not exists, create it
  if (!(await fs.pathExists(dir))) {
    await fs.mkdir(dir, { recursive: true });
  }

  // Get current path checksums
  const checksumsPath = path.resolve(dir, 'checksums.json');

  let checksums = {};
  if (await fs.exists(checksumsPath)) {
    try {
      checksums = await fs.readJson(checksumsPath);
    } catch (e) {
      leemons.log.error(`The integrity file ${checksumsPath} can not be read.`);
    }
  }

  // Get nextjs path checksums
  const currentChecksums = await readdirRecursive(dir, {
    checksums: true,
    ignore: ['checksums.json', /(yarn\.lock|package-lock\.json)$/, 'node_modules'],
  });

  if (checksums.integrity === currentChecksums.checksum) {
    leemons.log.silly(`${dir} Not Changed`);
    return { changed: false, checksums };
  }

  leemons.log.silly(`${dir} Changed`);
  return { changed: true, checksums: {} };
}

/**
 * Saves the checksums object in the given directory
 * @param {string} dir The directory where we want to save the checksums object
 * @param {object} checksums The checksums object we want to save
 */
async function saveChecksums(dir, checksums, pluginsEntries) {
  // Get installed plugins
  const plugins = pluginsEntries.map(([name]) => name);

  // Get current copied dirs
  const folder = (await fs.readdir(dir, { withFileTypes: true }))
    .filter((file) => file.isDirectory())
    .map((directory) => ({ name: directory.name, path: path.resolve(dir, directory.name) }));

  // Remove missing plugins from frontend
  await Promise.all(
    folder
      .filter((plugin) => !plugins.includes(plugin.name))
      .map(async (plugin) => {
        delete checksums[plugin.name];
        leemons.frontNeedsBuild = true;
        await fs.remove(plugin.path);
      })
  );

  // Generate new integrity
  checksums.integrity = (
    await readdirRecursive(dir, {
      checksums: true,
      ignore: ['checksums.json', /(yarn\.lock|package-lock\.json)$/, 'node_modules'],
    })
  ).checksum;

  // Save the current integrity
  await fs.writeJSON(path.resolve(dir, 'checksums.json'), checksums);
}

/**
 * Moves all the modified folders to the front directory
 */
async function loadFront(leemons, installedPlugins) {
  const plugins = installedPlugins.map((plugin) => [plugin.name, plugin]);
  const nextPath = leemons.dir.next;

  _.set(leemons, 'frontNeedsBuild', false);
  _.set(leemons, 'frontNeedsUpdateDeps', false);

  // Get plugins folder
  // const plugins = _.values(leemons.plugins);

  // Generate dest directories
  const pagesPath = path.resolve(nextPath, 'pages');
  const srcPath = path.resolve(nextPath, 'plugins');
  const depsPath = path.resolve(nextPath, 'dependencies');
  const publicPath = path.resolve(nextPath, 'public');

  // Get current pages checksums
  const pagesChecksums = (await checkDirChanges(pagesPath)).checksums;
  // Get current src checksums
  const srcChecksums = (await checkDirChanges(srcPath)).checksums;
  // Get current dependencies checksums
  const depsChecksums = (await checkDirChanges(depsPath)).checksums;
  // Get public files
  const publicChecksums = (await checkDirChanges(publicPath)).checksums;

  // Plugins' aliases system
  const aliases = {};
  const usedDeps = [];
  const nonInstalledDeps = [];

  // Get installed deps
  const nextDeps = (await fs.readJSON(path.resolve(nextPath, 'package.json'))).dependencies;
  // Move plugins folders

  await Promise.all(
    plugins.map(async ([, pluginObj]) => {
      const {
        name,
        dir: { app: pluginDir, next: pluginNext },
      } = pluginObj;
      // Each plugin root directory
      const dir = path.resolve(pluginDir, pluginNext);

      if (await fs.exists(dir)) {
        // Track which plugins have frontend
        _.set(pluginObj, 'hasFront', true);

        // Generate directory structure
        const folders = (await fs.readdir(dir, { withFileTypes: true }))
          .filter((plugin) => plugin.isDirectory())
          .map((plugin) => plugin.name);

        // #region Copy Pages
        if (folders.includes('pages')) {
          const pluginPages = path.resolve(dir, 'pages');
          if (await copyFolder(pluginPages, pagesPath, name, pagesChecksums)) {
            leemons.frontNeedsBuild = true;
          }
        }
        // #endregion

        // #region Copy src
        if (folders.includes('src')) {
          // Create the plugin src folder
          if (!(await fs.pathExists(srcPath))) {
            await fs.mkdir(srcPath, { recursive: true });
          }

          // Generate an alias
          aliases[`@${name}/*`] = [`${path.relative(nextPath, srcPath)}/${name}/*`];

          // Copy folder
          const pluginSrc = path.resolve(dir, 'src');
          if (await copyFolder(pluginSrc, srcPath, name, srcChecksums)) {
            leemons.frontNeedsBuild = true;
          }
        }

        // #endregion

        // #region Copy dependencies
        if (await fs.exists(path.resolve(dir, 'package.json'))) {
          // Create the next.js dependencies directory
          if (!(await fs.pathExists(depsPath))) {
            await fs.mkdir(depsPath, { recursive: true });
          }

          // Copy the package.json
          if (
            await copyPackageJSON(path.resolve(dir, 'package.json'), depsPath, name, depsChecksums)
          ) {
            leemons.frontNeedsUpdateDeps = true;
          }

          // Register useds deps
          usedDeps.push(`@leemons/${name}`);
          // If the dependencies are not registered register them
          if (!_.get(nextDeps, `@leemons/${name}`, null)) {
            nonInstalledDeps.push({
              name: `@leemons/${name}`,
              path: path.relative(nextPath, path.resolve(depsPath, name)),
            });
          }
        }
        // #endregion

        // #region Copy public files
        if (folders.includes('public')) {
          if (!(await fs.pathExists(publicPath))) {
            await fs.mkdir(publicPath, { recursive: true });
          }

          // Copy folder
          const pluginPublic = path.resolve(dir, 'public');
          if (await copyFolder(pluginPublic, publicPath, name, publicChecksums)) {
            leemons.frontNeedsBuild = true;
          }
        }
        // #endregion
      }
    })
  );

  // Generate a plugin loader
  await generatePluginLoader({ plugins, srcPath, srcChecksums, aliases, nextPath });

  // Set all the aliases
  let jsconfig;
  try {
    jsconfig = await fs.readJSON(path.resolve(nextPath, 'jsconfig.json'));
  } catch (e) {
    jsconfig = {};
  }

  // Merge current jsconfig and plugins jsconfig
  await fs.writeJSON(
    path.resolve(nextPath, 'jsconfig.json'),
    _.merge(jsconfig, {
      compilerOptions: {
        baseUrl: '.',
        paths: aliases,
      },
    })
  );

  // Generate the directory integrity file
  await saveChecksums(pagesPath, pagesChecksums, plugins);
  await saveChecksums(srcPath, srcChecksums, plugins);
  await saveChecksums(depsPath, depsChecksums, plugins);
  await saveChecksums(publicPath, publicChecksums, plugins);

  // Add plugins dependencies
  if (nonInstalledDeps.length) {
    const dependencyObject = _.fromPairs(
      nonInstalledDeps.map((dep) => [dep.name, `file:${dep.path}`])
    );
    await fs.writeJSON(
      path.resolve(nextPath, 'package.json'),
      _.merge(await fs.readJSON(path.resolve(nextPath, 'package.json')), {
        dependencies: dependencyObject,
      }),
      { spaces: 2 }
    );
    leemons.frontNeedsUpdateDeps = true;
  }

  // Prune dependencies
  const unusedDeps = _.difference(
    _.keys(nextDeps).filter((name) => name.startsWith('@leemons/')),
    usedDeps
  );

  if (unusedDeps.length) {
    await execa.command(`yarn --cwd ${nextPath} remove ${unusedDeps.join(' ')}`);
  }
}

module.exports = loadFront;
