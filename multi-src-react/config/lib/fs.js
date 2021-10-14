const fs = require('fs-extra');
const path = require('path');

async function _fileExists(dir, validateFiles = false) {
  try {
    if (!validateFiles) {
      return (await fs.lstat(dir)).isDirectory();
    }

    const stats = await fs.lstat(dir);
    return Boolean(stats) && !stats.isDirectory();
  } catch (e) {
    return false;
  }
}

// Check if exists and is not a folder
function fileExists(dir) {
  return _fileExists(dir, true);
}

// Check if exists and is a folder
function folderExists(dir) {
  return _fileExists(dir, false);
}

// Create folder and parents if needed
async function createFolder(dir) {
  try {
    await fs.mkdirp(dir);
  } catch (e) {
    throw new Error('Unable to create folder');
  }
}

// Create folder only if does not exists
async function createFolderIfMissing(dir) {
  try {
    if (!(await folderExists(dir))) {
      await createFolder(dir);
    }
  } catch (e) {
    throw new Error("Can't create folder");
  }
}

// Create a file with content
async function createFile(dir, content) {
  try {
    return await fs.writeFile(dir, content);
  } catch (e) {
    throw new Error("Can't save file");
  }
}

// Create a symbolic link
async function createSymLink(src, dest) {
  try {
    if (await folderExists(src)) {
      return await fs.createSymlink(src, dest);
    }
    return null;
  } catch (e) {
    throw new Error("Can't create symlink");
  }
}

// Get which file type is a file
function getFileType(file) {
  if (file.isSymbolicLink()) {
    return 'symbolicLink';
  }
  if (file.isDirectory()) {
    return 'directory';
  }
  if (file.isFile()) {
    return 'file';
  }

  return null;
}

// List all the files inside a directory
async function listFiles(dir, useMap = false) {
  try {
    const data = (await fs.readdir(dir, { withFileTypes: true })).map(
      (file) => ({
        name: file.name,
        type: getFileType(file),
      })
    );
    if (useMap) {
      const map = new Map();
      data.map((file) => map.set(file.name, file));
      return map;
    }
    return data;
  } catch (e) {
    throw new Error("Can't read directory");
  }
}

async function removeFiles(dir, files, ignored) {
  ignored.forEach((file) => files.delete(file));

  await Promise.all(
    [...files.values()].map((file) =>
      fs.rm(
        path.isAbsolute(file.name) ? file.name : path.resolve(dir, file.name),
        {
          recursive: true,
          force: true,
        }
      )
    )
  );
}

async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
  } catch (e) {
    throw new Error(`Can't copy file ${src} into ${dest}`);
  }
}

module.exports = {
  createFile,
  createFolder,
  createFolderIfMissing,
  createSymLink,
  fileExists,
  folderExists,
  listFiles,
  removeFiles,
  copyFile,
};
