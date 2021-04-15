/* eslint-disable no-param-reassign */

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const readdirRecursiveSync = require('leemons-utils/lib/readdirRecursiveSync');

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
    fs.mkdirSync(dir);
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
    ignore: ['checksums.json'],
  });

  if (checksums.integrity === currentChecksums.checksum) {
    leemons.log(dir, 'Not Changed');
    return { changed: false, checksums };
  }

  leemons.log(dir, 'Changed');
  leemons.needsBuild = true;
  checksums = {};
  return { changed: true, checksums };
}

/**
 *
 * @param {string} src The plugin folder we want to copy
 * @param {string} dest The final folder where we want the directory to be copied
 * @param {string} name The name of the plugin
 * @param {object} checksums The checksums object
 */
function copyFolder(src, dest, name, checksums) {
  const dirObj = readdirRecursiveSync(src, { checksums: true });
  if (checksums[name] !== dirObj.checksum) {
    leemons.log(`The plugin ${name} have changed`);
    leemons.needsBuild = true;

    // Move pages to nextjs
    fs.copySync(src, path.resolve(dest, name));
    checksums[name] = dirObj.checksum;
  }
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
      leemons.needsBuild = true;
      fs.rmdirSync(plugin.path, { recursive: true });
    });

  // Generate new integrity
  checksums.integrity = readdirRecursiveSync(dir, {
    checksums: true,
    ignore: ['checksums.json'],
  }).checksum;

  // Save the current integrity
  fs.writeJSONSync(path.resolve(dir, 'checksums.json'), checksums);
}

/**
 * Moves all the modified folders to the front directory
 */
function loadFront() {
  const nextPath = leemons.dir.next;

  // Detect plugins folder
  const plugins = _.values(leemons.plugins);

  const pagesPath = path.resolve(nextPath, 'pages');
  const srcPath = path.resolve(nextPath, 'src');

  // Get current pages checksums
  const pagesChecksums = checkDirChanges(pagesPath).checksums;
  // Get current src checksums
  const srcChecksums = checkDirChanges(srcPath).checksums;

  const aliases = {};

  // Move plugins folder
  plugins.forEach(({ name, dir: { app: pluginDir, next: pluginNext } }) => {
    const dir = path.resolve(pluginDir, pluginNext);

    if (fs.existsSync(dir)) {
      const folders = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((plugin) => plugin.isDirectory())
        .map((plugin) => plugin.name);
      // Move pages
      if (folders.includes('pages')) {
        const pluginPages = path.resolve(dir, 'pages');
        copyFolder(pluginPages, pagesPath, name, pagesChecksums);
      }

      // Move src
      if (!fs.pathExistsSync(path.resolve(nextPath, 'src'))) {
        fs.mkdirSync(path.resolve(nextPath, 'src'));
      }

      if (folders.includes('src')) {
        const pluginSrc = path.resolve(dir, 'src');
        aliases[`@${name}/*`] = [`src/${name}/*`];
        copyFolder(pluginSrc, srcPath, name, srcChecksums);
      }
    }
  });

  // Set all the aliases
  fs.writeJSONSync(path.resolve(nextPath, 'jsconfig.json'), {
    compilerOptions: {
      baseUrl: '.',
      paths: aliases,
    },
  });

  // Generate the directory integrity file
  saveChecksums(pagesPath, pagesChecksums);
  saveChecksums(srcPath, srcChecksums);
}

module.exports = loadFront;
