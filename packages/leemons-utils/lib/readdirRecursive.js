const { sync: md5File } = require('md5-file');
const { MD5: md5Object } = require('object-hash');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

function getFileType(file) {
  if (file.isDirectory()) {
    return 'directory';
  }
  if (file.isFile()) {
    return 'file';
  }
  if (file.isSymbolicLink()) {
    return 'symlink';
  }

  return '';
}

async function readdirRecursive(
  dir,
  { checksums = false, json = false, relative = dir, ignore = [] } = {}
) {
  if (!(await fs.exists(dir))) {
    throw new Error(`The directory ${dir} does not exist`);
  }
  const srcType = getFileType(await fs.lstat(dir));
  if (srcType === 'directory') {
    // Read every file in the current directory
    const content = await Promise.all(
      (await fs.readdir(dir, { withFileTypes: true }))
        .filter(
          (file) =>
            ignore.findIndex((expression) => {
              if (_.isRegExp(expression)) {
                return expression.test(file.name);
              }
              return file.name === expression;
            }) === -1
        )
        .map(async (file) => {
          const { name } = file;
          const type = getFileType(file);
          const fileDir = path.resolve(dir, file.name);

          // File structure
          let fileObj = { name, path: fileDir, type };
          // If the file is a directory, read that directory
          if (type === 'directory') {
            fileObj = await readdirRecursive(fileDir, { checksums, json, relative, ignore });

            // If it's a file and checksums is specified, get checksum of file
          } else if (type === 'file' && checksums) {
            fileObj.checksum = md5File(fileDir);
          }

          // If a relative path is specified, use that path (Used for checksums not based on directory)
          if (relative) {
            fileObj.path = path.relative(relative, fileDir);
          }

          return fileObj;
        })
    );

    // The object describing the current directory
    const dirObj = {
      name: path.basename(dir),
      type: 'directory',
      path: relative ? path.relative(relative, dir) : dir,
      content,
    };

    // If the json flag is on, use jsons instead of arrays (Use this if you know the files you are looking for)
    if (json) {
      if (dirObj.content.length) {
        dirObj.content = _.fromPairs(dirObj.content.map((file) => [file.name, file]));
      } else {
        dirObj.content = null;
      }
    }

    // Generate the checksum of the whole directory (based on file contents and folder structure)
    // When relative set to null, the checksum also depends on full paths
    if (checksums) {
      dirObj.checksum = md5Object(dirObj);
    }

    return dirObj;
  }
  if (srcType === 'file') {
    return {
      name: path.basename(dir),
      path: relative ? path.relative(relative, dir) : dir,
      checksum: md5File(dir),
    };
  }

  return null;
}

module.exports = readdirRecursive;
