const path = require('path');
const {
  createFolderIfMissing,
  createMissingPackageJSON,
  copyFile,
  copyFolder,
  copyFileWithSquirrelly,
  removeFiles,
} = require('../fs');
const { saveLockFile } = require('../lockFile');
const installDeps = require('./installDeps');
const linkSourceCode = require('./linkSourceCode');
const createJSConfig = require('./createJSConfig');
const createEslint = require('./createEsLint');

module.exports = async function generateMonorepo({ plugins, app, outputDir, basePath }) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { apiUrl } = require(`${app}/config/config`);

  console.log('outputDir', outputDir);

  const templateDir = path.resolve(__dirname, '../templates');
  await createFolderIfMissing(outputDir);
  await createMissingPackageJSON(path.resolve(outputDir, 'package.json'), {
    name: 'leemons-front',
    version: '1.0.0',
  });

  // Generate App index.js
  await copyFile(path.resolve(templateDir, 'index.js'), path.resolve(outputDir, 'index.js'));

  // Generate hotManagement.js
  await copyFile(
    path.resolve(templateDir, 'hotManagement.js'),
    path.resolve(outputDir, 'hotManagement.js')
  );

  // Generate reset global.css
  await copyFile(path.resolve(templateDir, 'global.css'), path.resolve(outputDir, 'global.css'));

  // Generate App contexts folder
  // await copyFolder(path.resolve(templateDir, 'contexts'), path.resolve(outputDir, 'contexts'));

  await copyFileWithSquirrelly(
    path.resolve(templateDir, 'contexts', 'global.squirrelly'),
    path.resolve(outputDir, 'contexts', 'global.js'),
    { apiUrl }
  );

  const modified = await saveLockFile(outputDir, plugins);

  if (modified) {
    // Copy App.js
    await copyFileWithSquirrelly(
      path.resolve(templateDir, 'App.squirrelly'),
      path.resolve(outputDir, 'App.js'),
      { plugins }
    );
  }

  const extraFiles = await linkSourceCode(path.resolve(outputDir, 'plugins'), plugins);

  await removeFiles(path.resolve(outputDir, 'plugins'), extraFiles);
  await installDeps(outputDir);

  if (basePath) {
    // Re-generate "jsconfig.json" file
    await createJSConfig({
      plugins,
      basePath,
    });

    // Re-generate ".eslintrc.json" file
    await createEslint({
      plugins,
      basePath,
    });
  }
};
