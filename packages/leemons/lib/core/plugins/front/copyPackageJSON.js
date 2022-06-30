/* eslint-disable no-param-reassign */

const { MD5: md5Object } = require('object-hash');

const fs = require('fs-extra');
const path = require('path');

/**
 *
 * @param {string} src The plugin file we want to copy
 * @param {string} dest The final folder where we want the file to be copied
 * @param {string} name The name of the plugin
 * @param {object} checksums The checksums object
 * @returns Will return true if the file was copied, and false if it wasn't necessary
 */
module.exports = async (src, dest, name, checksums) => {
  // Get frontend plugin' package.json
  const fileContent = await fs.readJSON(src);

  // Remove conflicting deps (react only allows 1 copy of react)
  if (fileContent.dependencies) {
    const depsToRemove = ['react', 'react-dom'];
    depsToRemove.forEach((dep) => {
      delete fileContent.dependencies[dep];
    });
  }

  // Get the checksums of the new package.json
  const fileChecksums = md5Object(fileContent);

  const fileName = path.basename(src);
  const finalDest = path.resolve(dest, name);

  if (checksums[name] !== fileChecksums) {
    leemons.log.debug(`The plugin ${name} in ${src} have changed`);

    // Move file to frontend
    if (!(await fs.exists(finalDest))) {
      await fs.mkdir(finalDest);
    }

    await fs.writeJSON(path.resolve(finalDest, fileName), fileContent);

    checksums[name] = fileChecksums;
    return true;
  }
  return false;
};
