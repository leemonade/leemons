/* eslint-disable global-require */
module.exports = {
  fileExists: require('./fileExists'),
  folderExists: require('./folderExists'),
  copyFile: require('./copyFile'),
  copyFolder: require('./copyFolder'),
  createFolder: require('./createFolder'),
  createFolderIfMissing: require('./createFolderIfMissing'),
  createMissingPackageJSON: require('./createMissingPackageJSON'),
  copyFileWithSquirrelly: require('./copyFileWithSquirrelly'),
  createSymlink: require('./createSymlink'),
  getFileType: require('./getFileType'),
  listFiles: require('./listFiles'),
  removeFiles: require('./removeFiles'),
};
