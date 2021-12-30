const fileExists = require('../../files/exists');
const assetExists = require('../exists');
const { assetsFiles } = require('../../tables');

module.exports = async function addFiles(file, asset, { transacting } = {}) {
  if (!(await fileExists(file, { transacting }))) {
    throw new Error('File not found');
  }

  if (!(await assetExists(asset, { transacting }))) {
    throw new Error('Asset not found');
  }

  return assetsFiles.set({ asset, file }, { transacting });
};
