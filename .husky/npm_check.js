const npmCheck = require('npm-check');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs').promises;

async function getFolders(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });
  return files.filter((file) => file.isDirectory()).map((file) => file.name);
}

async function check(folder) {
  const info = (await npmCheck({ cwd: folder })).all();

  // --- Add missing dependencies ---
  const missinKeys = Object.keys(info.missingFromPackageJson);
  if (missinKeys.length > 0) {
    for (let i = 0; i < missinKeys.length; i++) {
      process.chdir(folder);
      console.log(
        `Missing dependency from package.json (${missinKeys[i]}), installing latest version in ${folder}`
      );
      await exec(`yarn add ${missinKeys[i]}`);
      const pjson = JSON.parse(await fs.readFile(`${folder}/package.json`, 'utf8'));
      if (pjson.dependencies.hasOwnProperty(missinKeys[i])) {
        console.log(`Installed successfully.`);
      } else {
        console.error('Installed failed.');
        throw new Error('Installed failed.');
      }
    }
  }

  // --- Remove missing dependencies ---
  for (let package of info.packages) {
    if (package.unused) {
      process.chdir(folder);
      console.log(
        `Unused dependency from package.json (${package.moduleName}), uninstalling in ${folder}`
      );
      await exec(`yarn remove ${package.moduleName}`);
      const pjson = JSON.parse(await fs.readFile(`${folder}/package.json`, 'utf8'));
      if (pjson.dependencies.hasOwnProperty(package.moduleName)) {
        console.error('Uninstalled failed.');
        throw new Error('Uninstalled failed.');
      } else {
        console.log(`Uninstalled successfully.`);
      }
    }
  }

  // --- Check if dependencies are up to date ---
  let ignore = [];

  try {
    ignore = JSON.parse(await fs.readFile(`${folder}/ignore-dependencies-check.json`, 'utf8'));
  } catch (e) {
    // Nothing
  }
  for (let package of info.packages) {
    if (package.bump && ignore.indexOf(package.moduleName) === -1) {
      throw new Error(
        `${package.moduleName} can be updated from ${package.installed} to ${package.latest} (${folder})`
      );
    }
  }
  console.log(`package.json looks good. (${folder})`);
}

(async () => {
  const basePath = path.join(__dirname, '..');
  console.log('Checking packages:');
  const packages = await getFolders(basePath + '/packages');
  for (let folder of packages) {
    await check(`${basePath}/packages/${folder}`);
  }
  console.log('Checking plugins:');
  const plugins = await getFolders(basePath + '/plugins');
  for (let folder of plugins) {
    let exists = true;
    try {
      await fs.access(`${basePath}/plugins/${folder}/backend`);
    } catch (e) {
      exists = false;
    }
    if (exists) {
      await check(`${basePath}/plugins/${folder}/backend`);
    }
  }
})();
