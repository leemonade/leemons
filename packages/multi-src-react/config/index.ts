import fs from 'fs-extra';
import path from 'path';
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
  copyFileWithSquirrelly,
  copyFolder,
} from './lib/fs';
import compile from './lib/webpack';
import createReloader from './lib/watch';
import { hash } from './lib/crypto';
import { config } from 'webpack';

/* Dirs */
const frontDir = path.resolve(__dirname, '..', 'front');
const configDir = {
  lib: path.resolve(__dirname, 'lib'),
  src: path.resolve(__dirname, 'src'),
};

const pluginsFile = path.resolve(process.argv[2], 'enabledPlugins.json');

/* Helpers */
interface Plugin {
  name: string;
  path: string;
  public?: boolean;
  private?: boolean;
  hooks?: boolean;
  globalContext?: boolean;
  localContext?: boolean;
}

/* Global aliases */
const globalAliases = { '@leemons': frontDir };

// Get all the plugin which need to be installed on front
async function getPlugins(): Promise<Plugin[]> {
  const plugins = (await fs.readJSON(pluginsFile)) as {name:string, path: string}[];
  return plugins.map((plugin: {name:string, path: string}) => ({
    name: plugin.name,
    path: path.resolve(pluginsFile, '..', plugin.path),
  }));
}

// Create the package.json file if missing
async function createMissingPackageJSON(
  dir: string,
  config: Object
): Promise<boolean> {
  if (!(await fileExists(dir))) {
    await copyFileWithSquirrelly(
      path.resolve(configDir.src, 'package.json'),
      dir,
      config
    );
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
  await createFolderIfMissing(dir);

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

  // Return extra files
  return existingFiles;
}

// Check public/private routes
async function checkPluginPaths(plugin: Plugin): Promise<Plugin> {
  return {
    ...plugin,
    public: await fileExists(path.resolve(plugin.path, 'Public.js')),
    private: await fileExists(path.resolve(plugin.path, 'Private.js')),
    hooks: await fileExists(path.resolve(plugin.path, 'globalHooks.js')),
    globalContext: await fileExists(
      path.resolve(plugin.path, 'globalContext.js')
    ),
    localContext: await fileExists(
      path.resolve(plugin.path, 'localContext.js')
    ),
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

  // Generate App index.js
  await copyFile(
    path.resolve(configDir.src, 'index.js'),
    path.resolve(frontDir, 'index.js')
  );

  // Generate App contexts folder
  await copyFolder(
    path.resolve(configDir.src, 'contexts'),
    path.resolve(frontDir, 'contexts')
  );

  const modified = await saveLockFile(
    frontDir,
    await Promise.all(plugins.map(checkPluginPaths))
  );

  if (modified) {
    // Copy App.js
    await copyFileWithSquirrelly(
      path.resolve(configDir.src, 'App.squirrelly'),
      path.resolve(frontDir, 'App.js'),
      { plugins: await Promise.all(plugins.map(checkPluginPaths)) }
    );
  }

  const extraFiles = await linkSourceCode(
    path.resolve(dir, 'plugins'),
    plugins
  );

  await removeFiles(path.resolve(dir, 'plugins'), extraFiles);
  await installDeps(dir);
}

// Generate alias object for webpack
function generateAliases(dir: string, plugins: Plugin[]): {} {
  return plugins.reduce(
    (obj, plugin) => ({
      ...obj,
      [`@${plugin.name}`]: path.resolve(
        dir,
        'plugins',
        plugin.name
      ),
    }),
    { ...globalAliases }
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
        // Copy App.js
        await copyFileWithSquirrelly(
          path.resolve(configDir.src, 'App.squirrelly'),
          path.resolve(frontDir, 'App.js'),
          { plugins: await Promise.all(plugins.map(checkPluginPaths)) }
        );
      }
    }
  );

  // When a public/private file is added, recreate App.js
  createReloader({
    name: 'pluginsAppPaths',
    dirs: flatten(
      plugins.map((plugin: Plugin) => [
        path.resolve(plugin.path, 'Public.js'),
        path.resolve(plugin.path, 'Private.js'),
        path.resolve(plugin.path, 'globalHooks.js'),
        path.resolve(plugin.path, 'globalContext.js'),
        path.resolve(plugin.path, 'localContext.js'),
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
          // Copy App.js
          await copyFileWithSquirrelly(
            path.resolve(configDir.src, 'App.squirrelly'),
            path.resolve(frontDir, 'App.js'),
            { plugins: await Promise.all(plugins.map(checkPluginPaths)) }
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
      await stop();
      plugins = await getPlugins();
      await generateMonorepo(frontDir, plugins);
      stop = await compile(
        { alias: generateAliases(frontDir, plugins) },
        async () => {
          const modified = await saveLockFile(
            frontDir,
            await Promise.all(plugins.map(checkPluginPaths))
          );

          if (modified) {
            // Copy App.js
            await copyFileWithSquirrelly(
              path.resolve(configDir.src, 'App.squirrelly'),
              path.resolve(frontDir, 'App.js'),
              { plugins: await Promise.all(plugins.map(checkPluginPaths)) }
            );
          }
        }
      );
    },
  });
}

main();

// class LeemonsApi {
//   #reqMiddlewares: ((ctx?: Object, next?: Function) => Promise<void>)[];
//   #resMiddlewares: ((ctx?: Object, next?: Function) => Promise<any>)[];

//   constructor() {
//     this.#reqMiddlewares = [];
//     this.#resMiddlewares = [];
//     this.api.useReq = this.#use('req');
//     this.api.useRes = this.#use('res');
//   }

//   /* @ts-ignore */
//   api: { (): any; useReq: Function; useRes: Function } = async (
//     url: string,
//     config: Object
//   ) => {
//     const ctx = { url, config, middlewares: [] };

//     await this.#callMiddleware(this.#reqMiddlewares, 0, ctx);

//     const responseCtx = { middlewares: [], response: 'Carlos chupa pijas' };
//     await this.#callMiddleware(this.#resMiddlewares, 0, responseCtx);

//     return responseCtx.response;
//   };

//   #callMiddleware = async (
//     middlewares: Function[],
//     i: number,
//     ctx: { middlewares: boolean[] }
//   ) => {
//     if (!ctx.middlewares[i]) {
//       ctx.middlewares[i] = true;
//       const next = middlewares[i + 1]
//         ? () => this.#callMiddleware(middlewares, i + 1, ctx)
//         : () => {};
//       const middleware = middlewares[i] ? middlewares[i] : () => {};
//       await middleware(ctx, next);
//       await next();
//     }
//   };

//   #use =
//     (type: 'req' | 'res') =>
//     (middleware: (ctx?: Object, next?: Function) => Promise<void>) =>
//       (type === 'req' ? this.#reqMiddlewares : this.#resMiddlewares).push(
//         middleware
//       );
// }

// const leemonsApi = new LeemonsApi();
// let api = leemonsApi.api;

// api();

// api.useReq(async (ctx: { headers: Object }, next: Function) => {
//   ctx.headers = { Authorization: true };
// });

// api.useRes(async (ctx: { response: string }) => {
//   /* @ts-ignore */
//   ctx.response = { value: ctx.response };
// });

// // api.useRes(async (ctx: { response: any }, next: Function) => {
// //   console.log(ctx.response);
// // });

// api().then(console.log);
