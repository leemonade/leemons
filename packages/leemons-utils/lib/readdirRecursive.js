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
  return 'symlink';
}

async function readdirRecursive(
  dir,
  { checksums = false, json = false, relative = dir, ignore = [], throwOnMissing = true } = {}
) {
  const exists = await fs.exists(dir);
  if (!exists && throwOnMissing) {
    throw new Error(`The directory ${dir} does not exist`);
  } else if (exists) {
    const srcType = getFileType(await fs.lstat(dir));
    if (srcType === 'directory') {
      // Read every file in the current directory
      const content = await Promise.all(
        (await fs.readdir(dir, { withFileTypes: true }))
          .filter((file) => {
            const filePath = path.resolve(dir, file.name);
            return (
              ignore.findIndex((expression) => {
                if (_.isRegExp(expression)) {
                  return expression.test(file.name) || expression.test(filePath);
                }
                return file.name === expression || filePath === expression;
              }) === -1
            );
          })
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

    const object = {
      name: path.basename(dir),
      path: relative ? path.relative(relative, dir) : dir,
      type: srcType,
    };
    if (checksums) {
      object.checksum = md5File(dir);
    }
    return object;
  }

  return null;
}

/**
 * Get all the files recursively inside a directory
 * @param {*} data The readdirRecursive output
 * @returns {{path: import('fs').PathLike, checksum: string}[]}
 */
function getFilesArrayFromreaddirRecursive(data) {
  if (data && data.type === 'file') {
    return [{ path: data.path || data.name, checksum: data.checksum }];
  }
  if (data && data.type === 'directory') {
    return _.flattenDeep(data.content.map((element) => getFilesArrayFromreaddirRecursive(element)));
  }

  return [];
}

/**
 * Get the empty directories inside a directory
 * An empty directory is a folder which:
 *  does not have any file or directory inside itself
 *  has one or more directory inside itself which are empty
 * @param {*} data The readdirRecursive output
 * @returns {import('fs').PathLike[]}
 */
function getEmptyDirsFromreaddirRecursive(data) {
  // If the root file is of type file, return an empty array (nothing empty)
  if (data.type === 'file') {
    return [];
  }

  // Get all the directories inside the root (1 level)
  const directories = data.content.filter((file) => file.type === 'directory');

  // Get the directories that are empty (no children)
  const emptyDirectories = directories
    .filter((directory) => directory.content.length === 0)
    .map((file) => file.path);

  // Get the directories with children
  const nonEmptyDirectories = directories.filter((directory) => directory.content.length !== 0);

  // The current directory empty children' directories
  const emptyChildren = [
    // The empty directories (no children)
    ...emptyDirectories,
    // Continue looking inside
    ..._.flatten(
      nonEmptyDirectories.map((directory) => getEmptyDirsFromreaddirRecursive(directory))
    ),
  ];

  // If a directory has children but all of them are empty, then the directory is empty
  if (
    data.content
      .map((file) => file.path)
      .sort()
      .join(', ') === emptyChildren.sort().join(', ')
  ) {
    // Return the directory as empty
    return [data.path || '.'];
  }

  return emptyChildren;
}

module.exports = {
  readdirRecursive,
  getFilesArrayFromreaddirRecursive,
  getEmptyDirsFromreaddirRecursive,
};
