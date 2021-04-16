/* eslint-disable no-param-reassign */

const { MD5: md5Object } = require('object-hash');

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const readdirRecursiveSync = require('leemons-utils/lib/readdirRecursiveSync');

function filesToCopy(files) {
  return files
    .map((file) => {
      let fileObj = file;
      if (_.isString(file)) {
        fileObj = { path: file };
      }

      return _.defaults(fileObj, { required: false });
    })
    .filter((file) => (!file.required && fs.existsSync(file.path)) || file.required);
}

function generateFolderChecksum(src, extraFiles) {
  // Get all the checksums for extra files
  const filesObj = extraFiles
    /*
     * Generate the checksums for files to copy
     */
    .map(({ path: file }) =>
      readdirRecursiveSync(file, { checksums: true, relative: path.dirname(file) })
    );
  // Get the checksums for the src
  const dirObj = readdirRecursiveSync(src, { checksums: true });

  // Merge src checksums with extra files' ones
  filesObj.forEach((file) => {
    const equivalent = dirObj.content.findIndex((dirFile) => dirFile.path === file.path);
    if (equivalent >= 0) {
      dirObj.content[equivalent] = file;
    } else {
      dirObj.content.push(file);
    }
  });

  // Generate a new checksum
  delete dirObj.checksum;
  dirObj.checksum = md5Object(dirObj);

  return dirObj;
}

/**
 *
 * @param {string} src The plugin folder we want to copy
 * @param {string} dest The final folder where we want the directory to be copied
 * @param {string} name The name of the plugin
 * @param {object} checksums The checksums object
 */
function copyFolder(src, dest, name, checksums, addFiles = []) {
  const extraFiles = filesToCopy(addFiles);
  const dirObj = generateFolderChecksum(src, extraFiles);

  if (checksums[name] !== dirObj.checksum) {
    leemons.log(`The plugin ${name} have changed`);
    leemons.needsBuild = true;

    // Move pages to nextjs
    fs.copySync(src, path.resolve(dest, name));
    extraFiles.forEach(({ path: file }) => {
      fs.copySync(file, path.resolve(dest, name, path.basename(file)));
    });

    checksums[name] = dirObj.checksum;
  }
}

module.exports = { copyFolder };
