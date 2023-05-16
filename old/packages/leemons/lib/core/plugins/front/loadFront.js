/* eslint-disable no-param-reassign */

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const {
  readdirRecursive,
  getFilesArrayFromreaddirRecursive,
  getEmptyDirsFromreaddirRecursive,
} = require('leemons-utils/lib/readdirRecursive');
const execa = require('execa');
const { copyFolder } = require('./copyFolder');
const { generatePluginLoader } = require('./pluginLoader');
const copyPackageJSON = require('./copyPackageJSON');

/**
 * Removes the folders of those plugins no longer installed
 * @param {string} dir
 * @param {[pluginName:string][]} _plugins
 * @returns {Promise<void>}
 */
async function removeMissingPlugins(dir, _plugins) {
  const plugins = _plugins.map(([name]) => name);
  if (await fs.exists(dir)) {
    await Promise.all(
      (
        await fs.readdir(dir, { withFileTypes: true })
      )
        .filter((file) => file.isDirectory())
        .map((file) => file.name)
        // Get missing plugins
        .filter((plugin) => !plugins.includes(plugin))
        // Delete the missing plugins folders
        .map((plugin) => fs.rm(path.join(dir, plugin), { recursive: true }))
    );
  }
}

async function removeExtraFiles(dir, extra) {
  if (extra.length) {
    await Promise.all(extra.map((file) => fs.rm(path.join(dir, file), { recursive: true })));
    leemons.frontNeedsBuild = true;
  }
}

async function removeEmptyDirs(dir) {
  // Get the empty directories
  const emptyDirs = getEmptyDirsFromreaddirRecursive(
    await readdirRecursive(dir, { ignore: ['node_modules', 'src'] })
  );

  // If there are empty directories, delete them
  if (emptyDirs.length) {
    await Promise.all(emptyDirs.map((file) => fs.rm(path.join(dir, file), { recursive: true })));
    leemons.frontNeedsBuild = true;
  }
}

// TODO: Only copy changed files
/**
 * Gets the deleted and modified files between a src and a dest
 * @param {import('fs').PathLike} src The src directory
 * @param {import('fs').PathLike} dest The dest directory
 * @returns {{extra: import('fs').PathLike[], modified: import('fs').PathLike[]}} The files which dest has and src not, and also the files that are missing in dest or modified
 */
async function getDiff(src, dest) {
  const srcStructure = await readdirRecursive(src, { checksums: true });
  const destStructure = await readdirRecursive(dest, { checksums: true, throwOnMissing: false });

  const srcFiles = getFilesArrayFromreaddirRecursive(srcStructure);
  const destFiles = getFilesArrayFromreaddirRecursive(destStructure);

  const filesToDelete = destFiles
    .filter((destFile) => srcFiles.findIndex((srcFile) => srcFile.path === destFile.path) === -1)
    .map((file) => file.path);

  const modifiedFiles = srcFiles
    .filter((srcFile) => {
      const destFile = destFiles.find((_destFile) => _destFile.path === srcFile.path);
      return !(destFile && destFile.checksum === srcFile.checksum);
    })
    .map((file) => file.path);

  return {
    extra: filesToDelete,
    modified: modifiedFiles,
  };
}

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

  // Get frontend path checksums
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
  if (!(await fs.exists(dir))) {
    return;
  }
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
async function loadFront(leemons, installedPlugins, installedProviders) {
  const providers = _.map(_.cloneDeep(installedProviders), (provider) => {
    provider.name = `provider-${provider.name}`;
    return provider;
  });

  const plugins = installedPlugins
    .map((plugin) => [plugin.name, plugin])
    .concat(providers.map((provider) => [provider.name, provider]));
  const frontendPath = leemons.dir.frontend;

  // Flags for compilation
  _.set(leemons, 'frontNeedsBuild', false);
  _.set(leemons, 'frontNeedsUpdateDeps', false);

  // Generate dest directories
  const pagesPath = path.resolve(frontendPath, 'pages');
  const srcPath = path.resolve(frontendPath, 'plugins');
  const depsPath = path.resolve(frontendPath, 'dependencies');
  const publicPath = path.resolve(frontendPath, 'public');

  await Promise.all([
    removeMissingPlugins(pagesPath, plugins),
    removeMissingPlugins(srcPath, plugins),
    removeMissingPlugins(depsPath, plugins),
    removeMissingPlugins(publicPath, plugins),
  ]);

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
  const frontendDeps = (await fs.readJSON(path.resolve(frontendPath, 'package.json'))).dependencies;
  // Move plugins folders

  await Promise.all(
    plugins.map(async ([, pluginObj]) => {
      const {
        name,
        dir: { app: pluginDir, frontend: pluginFrontend },
      } = pluginObj;
      // Each plugin root directory
      const dir = path.resolve(pluginDir, pluginFrontend);

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
          const { extra } = await getDiff(pluginPages, path.join(pagesPath, pluginObj.name));
          // If some extra files are missing, delete them (from app)
          await removeExtraFiles(path.join(pagesPath, pluginObj.name), extra);

          // Copy the new folder
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
          aliases[`@${name}/*`] = [`${path.relative(frontendPath, srcPath)}/${name}/*`];

          const pluginSrc = path.resolve(dir, 'src');

          const { extra } = await getDiff(pluginSrc, path.join(srcPath, pluginObj.name));
          // If some extra files are missing, delete them (from app)
          await removeExtraFiles(path.join(srcPath, pluginObj.name), extra);

          // Copy folder
          if (await copyFolder(pluginSrc, srcPath, name, srcChecksums)) {
            leemons.frontNeedsBuild = true;
          }
        }

        // #endregion

        // #region Copy dependencies
        if (await fs.exists(path.resolve(dir, 'package.json'))) {
          // Create the frontend dependencies directory
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
          if (!_.get(frontendDeps, `@leemons/${name}`, null)) {
            nonInstalledDeps.push({
              name: `@leemons/${name}`,
              path: path.relative(frontendPath, path.resolve(depsPath, name)),
            });
          }
        } else if (await fs.exists(path.resolve(depsPath, name))) {
          await fs.rm(path.resolve(depsPath, name), { recursive: true });
        }
        // #endregion

        // #region Copy public files
        if (folders.includes('public')) {
          if (!(await fs.pathExists(publicPath))) {
            await fs.mkdir(publicPath, { recursive: true });
          }

          // Copy folder
          const pluginPublic = path.resolve(dir, 'public');

          const { extra } = await getDiff(pluginPublic, path.join(publicPath, pluginObj.name));
          // If some extra files are missing, delete them (from app)
          await removeExtraFiles(path.join(publicPath, pluginObj.name), extra);

          if (await copyFolder(pluginPublic, publicPath, name, publicChecksums)) {
            leemons.frontNeedsBuild = true;
          }
        }
        // #endregion
      }
    })
  );

  await removeEmptyDirs(frontendPath);
  // Generate a plugin loader
  await generatePluginLoader({ plugins, srcPath, srcChecksums, aliases, frontendPath });

  // Set all the aliases
  let jsconfig;
  try {
    jsconfig = await fs.readJSON(path.resolve(frontendPath, 'jsconfig.json'));
  } catch (e) {
    jsconfig = {};
  }

  // Merge current jsconfig and plugins jsconfig
  await fs.writeJSON(
    path.resolve(frontendPath, 'jsconfig.json'),
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
      path.resolve(frontendPath, 'package.json'),
      _.merge(await fs.readJSON(path.resolve(frontendPath, 'package.json')), {
        dependencies: dependencyObject,
      }),
      { spaces: 2 }
    );
    leemons.frontNeedsUpdateDeps = true;
  }

  // Prune dependencies
  const unusedDeps = _.difference(
    _.keys(frontendDeps).filter((name) => name.startsWith('@leemons/')),
    usedDeps
  );

  if (unusedDeps.length) {
    await execa.command(`yarn --cwd ${frontendPath} remove ${unusedDeps.join(' ')}`);
  }
}

module.exports = loadFront;
