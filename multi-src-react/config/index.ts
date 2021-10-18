import fs from 'fs-extra';
import path from 'path';
const squirrelly = require('squirrelly');
import execa from 'execa';
import { flatten } from 'lodash';
import {
  createFile,
  createFolderIfMissing,
  fileExists,
  listFiles,
  createSymLink,
  copyFile,
  removeFiles,
  fileList,
} from './lib/fs';
import compile from './lib/webpack';
import createReloader from './lib/watch';
import { hash } from './lib/crypto';

/* Squirrelly Helpers */
squirrelly.helpers.define(
  'capitalize',
  ({ params: [str] }: { params: string[] }) =>
    str.charAt(0).toUpperCase() + str.substring(1)
);

/* Dirs */
const frontDir = path.resolve(__dirname, '..', 'front');
const configDir = {
  lib: path.resolve(__dirname, 'lib'),
  src: path.resolve(__dirname, 'src'),
};
const pluginsFile = path.resolve(__dirname, '..', 'files.json');

/* Helpers */
interface Plugin {
  name: string;
  path: string;
  public?: boolean;
  private?: boolean;
}

// Get all the plugin which need to be installed on front
async function getPlugins(): Promise<Plugin[]> {
  const plugins = (await fs.readJSON(pluginsFile)) as string[];
  return plugins.map((plugin: string) => ({
    name: path.basename(plugin),
    path: path.resolve(pluginsFile, '..', plugin),
  }));
}

// Get package.json file as string
function getPackageJSON(config: Object): string {
  return squirrelly.renderFile(
    path.resolve(__dirname, 'src', 'packageJSON.json'),
    config
  );
}

// Create the package.json file if missing
async function createMissingPackageJSON(
  dir: string,
  config: Object
): Promise<boolean> {
  if (!(await fileExists(dir))) {
    const packageJSON = await getPackageJSON(config);
    await createFile(dir, packageJSON);
    return true;
  }
  return false;
}

// Intall front monorepo dependencies
function installDeps(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const { stdout, stderr } = execa.command(`yarn --cwd ${dir}`);

    if (stderr) {
      stderr.on('data', (e) => {
        const message = e.toString();
        if (message.startsWith('warning')) {
          console.log(message);
        } else {
          reject(new Error(message));
        }
      });
    }

    if (stdout) {
      stdout.pipe(process.stdout);

      stdout.on('end', () => {
        resolve();
      });
    }
  });
}

// Save the current src files as symlinks in frontdir
async function linkSourceCode(
  dir: string,
  plugins: Plugin[]
): Promise<Map<string, fileList>> {
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
async function copyAppJS(dir: string, plugins: Plugin[]): Promise<void> {
  const App = await squirrelly.renderFile(
    path.resolve(configDir.src, 'App.squirrelly'),
    {
      plugins,
    }
  );

  await fs.writeFile(dir, App);
}

// Check public/private routes
async function checkPluginPaths(plugin: Plugin): Promise<Plugin> {
  return {
    ...plugin,
    public: await fileExists(path.resolve(plugin.path, 'index.js')),
    private: await fileExists(path.resolve(plugin.path, 'private.js')),
  };
}

// Generate current status description file
async function generateLockFile(plugins: Plugin[]): Promise<{
  plugins: Plugin[];
  hash: string | null;
}> {
  const lockFile: { plugins: Plugin[]; hash: string | null } = {
    plugins,
    hash: null,
  };

  lockFile.hash = hash(lockFile);
  return lockFile;
}

// Get saved lock file
async function getSavedLockFile(lockDir: string): Promise<{
  plugins?: Plugin[];
  hash: string | null;
}> {
  let oldLock = { hash: null };
  try {
    oldLock = await fs.readJSON(lockDir);
  } catch (e) {
    // Do not throw
  }

  return oldLock;
}

// Save Leemons Lock File if modified
async function saveLockFile(dir: string, plugins: Plugin[]): Promise<boolean> {
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
async function generateMonorepo(dir: string, plugins: Plugin[]): Promise<void> {
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
function generateAliases(dir: string, plugins: Plugin[]): {} {
  return plugins.reduce(
    (obj, plugin) => ({
      ...obj,
      [`@${plugin.name}`]: path.resolve(dir, path.basename(plugin.path)),
    }),
    {}
  );
}

// Main function of the service
async function main(): Promise<void> {
  let plugins = await getPlugins();

  await generateMonorepo(frontDir, plugins);

  // Start compilation process
  let stop = await compile(
    { alias: generateAliases(frontDir, plugins) },
    // Trigger function when code changes are detected
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

  // When a public/private file is added, recreate App.js
  createReloader({
    name: 'publicPrivatePaths',
    dirs: flatten(
      plugins.map((plugin: Plugin) => [
        path.resolve(plugin.path, 'index.js'),
        path.resolve(plugin.path, 'private.js'),
      ])
    ),
    config: {
      ignoreInitial: true,
      followSymlinks: true,
      // Wait to the system write call
      // awaitWriteFinish: true,
    },
    handler: async (event, filename) => {
      // Only trigger add events
      if (event === 'add') {
        // setTimeout(async () => {
        // Regenerate LockFile
        const modified = await saveLockFile(
          frontDir,
          await Promise.all(plugins.map(checkPluginPaths))
        );

        // Regenerate AppJS
        if (modified) {
          await copyAppJS(
            path.resolve(frontDir, 'App.js'),
            await Promise.all(plugins.map(checkPluginPaths))
          );
        }
        // }, 1500);
      }
    },
  });

  // TODO: Remove watcher, move to api call
  // Watch to the plugins file, and rebuild when updated
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
