/* eslint-disable no-param-reassign */

const { MD5: md5Object } = require('object-hash');

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { readdirRecursive } = require('leemons-utils/lib/readdirRecursive');

async function filesToCopy(files) {
  return (
    await Promise.all(
      files.map(async (file) => {
        let fileObj = file;
        if (_.isString(file)) {
          fileObj = { path: file };
        }
        fileObj = _.defaults(fileObj, { required: false });

        if ((!fileObj.required && (await fs.exists(fileObj.path))) || fileObj.required) {
          return fileObj;
        }
        return null;
      })
    )
  ).filter((file) => file);
}

async function generateFolderChecksum(src, extraFiles) {
  // Get all the checksums for extra files
  const filesObj = await Promise.all(
    extraFiles
      /*
       * Generate the checksums for files to copy
       */
      .map(({ path: file }) =>
        readdirRecursive(file, {
          checksums: true,
          relative: path.dirname(file),
          ignore: [/(yarn\.lock|package-lock\.json)$/, 'node_modules'],
        })
      )
  );
  // Get the checksums for the src
  const dirObj = await readdirRecursive(src, {
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
async function copyFile(src, dest, name, checksums) {
  const fileChecksums = await readdirRecursive(src, { checksums: true });
  const fileName = path.basename(src);
  const finalDest = path.resolve(dest, name);

  if (checksums[name] !== fileChecksums.checksum) {
    leemons.log.debug(`The plugin ${name} in ${src} have changed`);

    // Move file to frontend folder
    if (!(await fs.exists(finalDest))) {
      await fs.mkdir(finalDest);
    }
    await fs.copyFile(src, path.resolve(finalDest, fileName));

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
async function copyFolder(src, dest, name, checksums, addFiles = []) {
  const extraFiles = await filesToCopy(addFiles);
  const dirObj = await generateFolderChecksum(src, extraFiles);

  if (checksums[name] !== dirObj.checksum) {
    leemons.log.debug(`The plugin ${name} in ${src} have changed`);

    // Move folder to frontend
    await fs.copy(src, path.resolve(dest, name));
    await Promise.all(
      extraFiles.map(({ path: file }) =>
        fs.copy(file, path.resolve(dest, name, path.basename(file)))
      )
    );

    checksums[name] = dirObj.checksum;
    return true;
  }
  return false;
}

module.exports = { copyFolder, copyFile };
