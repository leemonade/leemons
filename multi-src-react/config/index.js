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
} = require('./lib/fs');
const { compile } = require('./lib/webpack');

squirrelly.helpers.define(
  'capitalize',
  ({ params: [str] }) => str.charAt(0).toUpperCase() + str.substring(1)
);

const frontDir = path.resolve(__dirname, '..', 'front');
const configDir = {
  lib: path.resolve(__dirname, 'lib'),
  src: path.resolve(__dirname, 'src'),
};
const pluginsFile = path.resolve(__dirname, '..', 'files.json');

// Get all the plugin which need to be installed on front
async function getPlugins() {
  const plugins = await fs.readJSON(pluginsFile);
  return plugins.map((plugin) => ({
    name: path.basename(plugin),
    path: path.resolve(pluginsFile, '..', plugin),
  }));
}

// Get package.json file as string
async function getPackageJSON(config) {
  const packageJSON = await fs.readFile(
    path.resolve(__dirname, 'src', 'packageJSON.json')
  );
  return squirrelly.render(packageJSON.toString(), config);
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
      return null;
    })
  );
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
  await copyAppJS(path.resolve(frontDir, 'App.js'), plugins);

  await linkSourceCode(dir, plugins);
  await installDeps(dir);
}

function generateAliases(plugins) {
  return plugins.reduce(
    (obj, plugin) => ({
      ...obj,
      [`@${plugin.name}`]: plugin.path,
    }),
    {}
  );
}

async function main() {
  const plugins = await getPlugins();

  await generateMonorepo(frontDir, plugins);

  const stop = await compile({ alias: generateAliases(plugins) }, async () => {
    console.log('Changed :D');
  });
}

main();
