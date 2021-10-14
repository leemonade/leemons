const fs = require('fs-extra');
const path = require('path');
const squirrelly = require('squirrelly');
const execa = require('execa');
const {
  createFile,
  createFolderIfMissing,
  fileExists,
  listFiles,
  createSymLink,
  copyFile,
  removeFiles,
} = require('./lib/fs');
const { compile } = require('./lib/webpack');
const { createReloader } = require('./lib/watch');
const { hash } = require('./lib/crypto');

/* Squirrelly Helpers */
squirrelly.helpers.define(
  'capitalize',
  ({ params: [str] }) => str.charAt(0).toUpperCase() + str.substring(1)
);

/* Dirs */
const frontDir = path.resolve(__dirname, '..', 'front');
const configDir = {
  lib: path.resolve(__dirname, 'lib'),
  src: path.resolve(__dirname, 'src'),
};
const pluginsFile = path.resolve(__dirname, '..', 'files.json');

/* Helpers */

// Get all the plugin which need to be installed on front
async function getPlugins() {
  const plugins = await fs.readJSON(pluginsFile);
  return plugins.map((plugin) => ({
    name: path.basename(plugin),
    path: path.resolve(pluginsFile, '..', plugin),
  }));
}

// Get package.json file as string
function getPackageJSON(config) {
  return squirrelly.renderFile(
    path.resolve(__dirname, 'src', 'packageJSON.json'),
    config
  );
}

// Create the package.json file if missing
async function createMissingPackageJSON(dir, config) {
  if (!(await fileExists(dir))) {
    const packageJSON = await getPackageJSON(config);
    await createFile(dir, packageJSON);
    return true;
  }
  return false;
}

// Intall front monorepo dependencies
function installDeps(dir) {
  return new Promise((resolve, reject) => {
    const { stdout, stderr } = execa.command(`yarn --cwd ${dir}`);

    stderr.on('data', (e) => {
      const message = e.toString();
      if (message.startsWith('warning')) {
        console.log(message);
      } else {
        reject(new Error(message));
      }
    });

    stdout.pipe(process.stdout);

    stdout.on('end', () => {
      resolve();
    });
  });
}

// Save the current src files as symlinks in frontdir
async function linkSourceCode(dir, plugins) {
  // TODO: Save a file describing each file (maybe has the same name but different dir, so needs to be recopied)
  // Check which files still exists
  const existingFiles = await listFiles(dir, true);

  // Create the missing symlinks
  await Promise.all(
    plugins.map(({ name, path: pluginDir }) => {
      if (!existingFiles.get(name)) {
        return createSymLink(pluginDir, path.resolve(dir, name));
      }
      existingFiles.delete(name);

      return null;
    })
  );
  return existingFiles;
}

// Generate app.js file
async function copyAppJS(dir, plugins) {
  const App = await squirrelly.renderFile(
    path.resolve(configDir.src, 'App.squirrelly'),
    {
      plugins,
    }
  );

  await fs.writeFile(dir, App);
}

// Check public/private routes
async function checkPluginPaths(plugin) {
  return {
    ...plugin,
    public: await fileExists(path.resolve(plugin.path, 'index.js')),
    private: await fileExists(path.resolve(plugin.path, 'private.js')),
  };
}

// Generate current status description file
async function generateLockFile(plugins) {
  const lockFile = {
    plugins,
  };
  lockFile.hash = hash(lockFile);

  return lockFile;
}

// Get saved lock file
async function getSavedLockFile(lockDir) {
  let oldLock = {};
  try {
    oldLock = await fs.readJSON(lockDir);
  } catch (e) {
    oldLock.hash = null;
  }

  return oldLock;
}

// Save Leemons Lock File if modified
async function saveLockFile(dir, plugins) {
  const lockDir = path.resolve(dir, 'leemons.lock.json');
  const lockFile = await generateLockFile(plugins);
  const oldLock = await getSavedLockFile(lockDir);

  if (lockFile.hash !== oldLock.hash) {
    await fs.writeJSON(lockDir, lockFile);
    return true;
  }

  return false;
}

// Generate the monorepo related files
async function generateMonorepo(dir, plugins) {
  await createFolderIfMissing(dir);
  await createMissingPackageJSON(path.resolve(dir, 'package.json'), {
    name: 'leemons-front',
    version: '1.0.0',
  });

  await copyFile(
    path.resolve(configDir.src, 'index.js'),
    path.resolve(frontDir, 'index.js')
  );

  const modified = await saveLockFile(
    frontDir,
    await Promise.all(plugins.map(checkPluginPaths))
  );

  if (modified) {
    await copyAppJS(
      path.resolve(frontDir, 'App.js'),
      await Promise.all(plugins.map(checkPluginPaths))
    );
  }

  const extraFiles = await linkSourceCode(dir, plugins);

  await removeFiles(dir, extraFiles, [
    'node_modules',
    'package.json',
    'yarn.lock',
    'leemons.lock.json',
    'App.js',
    'index.js',
  ]);
  await installDeps(dir);
}

// Generate alias object for webpack
function generateAliases(dir, plugins) {
  return plugins.reduce(
    (obj, plugin) => ({
      ...obj,
      [`@${plugin.name}`]: path.resolve(dir, path.basename(plugin.path)),
    }),
    {}
  );
}

// Main function of the service
async function main() {
  let plugins = await getPlugins();

  await generateMonorepo(frontDir, plugins);

  let stop = await compile(
    { alias: generateAliases(frontDir, plugins) },
    async () => {
      const modified = await saveLockFile(
        frontDir,
        await Promise.all(plugins.map(checkPluginPaths))
      );

      if (modified) {
        await copyAppJS(
          path.resolve(frontDir, 'App.js'),
          await Promise.all(plugins.map(checkPluginPaths))
        );
      }
    }
  );

  createReloader({
    name: 'Leemons Front',
    dirs: pluginsFile,
    logger: console,
    handler: async () => {
      plugins = await getPlugins();
      await generateMonorepo(frontDir, plugins);
      await stop();
      stop = await compile(
        { alias: generateAliases(frontDir, plugins) },
        async () => {
          const modified = await saveLockFile(
            frontDir,
            await Promise.all(plugins.map(checkPluginPaths))
          );

          if (modified) {
            await copyAppJS(
              path.resolve(frontDir, 'App.js'),
              await Promise.all(plugins.map(checkPluginPaths))
            );
          }
        }
      );
    },
  });
}

main();
