const path = require('path');
const copyFileWithSquirrelly = require('./copyFileWithSquirrelly');
const fileExists = require('./fileExists');

module.exports = async function createMissingPackageJSON(dir, config) {
  if (!(await fileExists(dir))) {
    await copyFileWithSquirrelly(path.resolve(__dirname, '../templates/package.json'), dir, config);
    return true;
  }
  return false;
};
