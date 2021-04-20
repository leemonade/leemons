/* eslint-disable no-param-reassign */

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const readdirRecursiveSync = require('leemons-utils/lib/readdirRecursiveSync');
const execa = require('execa');
const { copyFolder, copyFile } = require('./copyFolder');

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
function checkDirChanges(dir) {
  // If directory does not exists, create it
  if (!fs.pathExistsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Get current path checksums
  const checksumsPath = path.resolve(dir, 'checksums.json');

  let checksums = {};
  if (fs.existsSync(checksumsPath)) {
    checksums = fs.readJsonSync(checksumsPath);
  }

  // Get nextjs path checksums
  const currentChecksums = readdirRecursiveSync(dir, {
    checksums: true,
    ignore: ['checksums.json', /(yarn\.lock|package-lock\.json)$/, 'node_modules'],
  });

  if (checksums.integrity === currentChecksums.checksum) {
    leemons.log(dir, 'Not Changed');
    return { changed: false, checksums };
  }

  leemons.log(dir, 'Changed');
  return { changed: true, checksums: {} };
}

/**
 * Saves the checksums object in the given directory
 * @param {string} dir The directory where we want to save the checksums object
 * @param {object} checksums The checksums object we want to save
 */
function saveChecksums(dir, checksums) {
  // Get installed plugins
  const plugins = _.values(leemons.plugins).map((plugin) => plugin.name);

  // Get current copied dirs
  const folder = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((directory) => ({ name: directory.name, path: path.resolve(dir, directory.name) }));

  // Remove missing plugins from frontend
  folder
    .filter((plugin) => !plugins.includes(plugin.name))
    .forEach((plugin) => {
      delete checksums[plugin.name];
      leemons.frontNeedsBuild = true;
      fs.removeSync(plugin.path);
    });

  // Generate new integrity
  checksums.integrity = readdirRecursiveSync(dir, {
    checksums: true,
    ignore: ['checksums.json', /(yarn\.lock|package-lock\.json)$/, 'node_modules'],
  }).checksum;

  // Save the current integrity
  fs.writeJSONSync(path.resolve(dir, 'checksums.json'), checksums);
}

/**
 * Moves all the modified folders to the front directory
 */
function loadFront(plugins) {
  const nextPath = leemons.dir.next;

  // Get plugins folder
  // const plugins = _.values(leemons.plugins);

  // Generate dest directories
  const pagesPath = path.resolve(nextPath, 'pages');
  const srcPath = path.resolve(nextPath, 'plugins');
  const depsPath = path.resolve(nextPath, 'dependencies');

  // Get current pages checksums
  const pagesChecksums = checkDirChanges(pagesPath).checksums;
  // Get current src checksums
  const srcChecksums = checkDirChanges(srcPath).checksums;
  // Get current dependencies checksums
  const depsChecksums = checkDirChanges(depsPath).checksums;

  // Plugins' aliases system
  const aliases = {};
  const usedDeps = [];
  const nonInstalledDeps = [];

  // Get installed deps
  const nextDeps = fs.readJSONSync(path.resolve(nextPath, 'package.json')).dependencies;
  // Move plugins folders
  plugins.forEach(([, pluginObj]) => {
    const {
      name,
      dir: { app: pluginDir, next: pluginNext },
    } = pluginObj;
    // Each plugin root directory
    const dir = path.resolve(pluginDir, pluginNext);

    if (fs.existsSync(dir)) {
      // Track which plugins have frontend
      _.set(pluginObj, 'hasFront', true);

      // Generate directory structure
      const folders = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((plugin) => plugin.isDirectory())
        .map((plugin) => plugin.name);

      // Move pages
      if (folders.includes('pages')) {
        const pluginPages = path.resolve(dir, 'pages');
        if (copyFolder(pluginPages, pagesPath, name, pagesChecksums)) {
          leemons.frontNeedsBuild = true;
        }
      }

      // Move src
      if (folders.includes('src')) {
        // Create the plugin src folder
        if (!fs.pathExistsSync(srcPath)) {
          fs.mkdirSync(srcPath, { recursive: true });
        }

        // Generate an alias
        aliases[`@${name}/*`] = [`${path.relative(nextPath, srcPath)}/${name}/*`];

        // Copy folder
        const pluginSrc = path.resolve(dir, 'src');
        if (copyFolder(pluginSrc, srcPath, name, srcChecksums)) {
          leemons.frontNeedsBuild = true;
        }
      }

      // Move dependencies
      if (fs.existsSync(path.resolve(dir, 'package.json'))) {
        // Create the next.js dependencies directory
        if (!fs.pathExistsSync(depsPath)) {
          fs.mkdirSync(depsPath, { recursive: true });
        }

        // Copy the package.json
        if (copyFile(path.resolve(dir, 'package.json'), depsPath, name, depsChecksums)) {
          leemons.frontNeedsUpdateDeps = true;
        }

        // Register useds deps
        usedDeps.push(`@leemons/${name}`);
        // If the dependencies are not registered register them
        if (!_.get(nextDeps, `@leemons/${name}`, null)) {
          nonInstalledDeps.push({ name: `@leemons/${name}`, path: path.resolve(depsPath, name) });
        }
      }
    }
  });

  // Set all the aliases
  let jsconfig;
  try {
    jsconfig = fs.readJSONSync(path.resolve(nextPath, 'jsconfig.json'));
  } catch (e) {
    jsconfig = {};
  }

  // Merge current jsconfig and plugins jsconfig
  fs.writeJSONSync(
    path.resolve(nextPath, 'jsconfig.json'),
    _.merge(jsconfig, {
      compilerOptions: {
        baseUrl: '.',
        paths: aliases,
      },
    })
  );

  // Generate the directory integrity file
  saveChecksums(pagesPath, pagesChecksums);
  saveChecksums(srcPath, srcChecksums);
  saveChecksums(depsPath, depsChecksums);

  // Add plugins dependencies
  if (nonInstalledDeps.length) {
    const dependencyObject = _.fromPairs(
      nonInstalledDeps.map((dep) => [dep.name, `file:${dep.path}`])
    );
    fs.writeJSONSync(
      path.resolve(nextPath, 'package.json'),
      _.merge(fs.readJSONSync(path.resolve(nextPath, 'package.json')), {
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
    execa.commandSync(`yarn --cwd ${nextPath} remove ${unusedDeps.join(' ')}`);
  }
}

module.exports = loadFront;
