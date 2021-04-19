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
      readdirRecursiveSync(file, {
        checksums: true,
        relative: path.dirname(file),
        ignore: [/(yarn\.lock|package-lock\.json)$/, 'node_modules'],
      })
    );
  // Get the checksums for the src
  const dirObj = readdirRecursiveSync(src, {
    checksums: true,
    ignore: [/(yarn\.lock|package-lock\.json)$/, 'node_modules'],
  });

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
 * @param {string} src The plugin file we want to copy
 * @param {string} dest The final folder where we want the file to be copied
 * @param {string} name The name of the plugin
 * @param {object} checksums The checksums object
 * @returns Will return true if the file was copied, and false if it wasn't necessary
 */
function copyFile(src, dest, name, checksums) {
  const fileChecksums = readdirRecursiveSync(src, { checksums: true });
  const fileName = path.basename(src);
  const finalDest = path.resolve(dest, name);

  if (checksums[name] !== fileChecksums.checksum) {
    leemons.log(`The plugin ${name} in ${src} have changed`);

    // Move file to next.js
    if (!fs.existsSync(finalDest)) {
      fs.mkdirSync(finalDest);
    }
    fs.copyFileSync(src, path.resolve(finalDest, fileName));

    checksums[name] = fileChecksums.checksum;
    return true;
  }
  return false;
}

/**
 *
 * @param {string} src The plugin folder we want to copy
 * @param {string} dest The final folder where we want the directory to be copied
 * @param {string} name The name of the plugin
 * @param {object} checksums The checksums object
 * @returns Will return true if the folder was copied, and false if it wasn't necessary
 */
function copyFolder(src, dest, name, checksums, addFiles = []) {
  const extraFiles = filesToCopy(addFiles);
  const dirObj = generateFolderChecksum(src, extraFiles);

  if (checksums[name] !== dirObj.checksum) {
    leemons.log(`The plugin ${name} in ${src} have changed`);

    // Move folder to next.js
    fs.copySync(src, path.resolve(dest, name));
    extraFiles.forEach(({ path: file }) => {
      fs.copySync(file, path.resolve(dest, name, path.basename(file)));
    });

    checksums[name] = dirObj.checksum;
    return true;
  }
  return false;
}

module.exports = { copyFolder, copyFile };
