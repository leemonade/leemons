/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const path = require('path');
const fsPromises = require('fs/promises');

/**
 * Handles the file system for the given file.
 * If the file is not a folder, it writes an empty file to the file's URI.
 * If the file is a folder, it creates directories for each file path and writes an empty file to each path.
 *
 * @param {Object} params - The parameters for handling the file system.
 * @param {LibraryFile} params.file - The file to handle.
 * @param {Array} params.filePaths - The paths of the file.
 * @returns {Promise<LibraryFile>} A promise that resolves with the handled file.
 */
async function handleFileSystem({ file, filePaths }) {
  file.provider = 'sys';

  if (!file.isFolder) {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}.${file.extension}`);
    await fsPromises.writeFile(file.uri, '');
  } else {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}`);
    Promise.allSettled(
      filePaths.map((filePath) =>
        fsPromises
          .mkdir(path.dirname(`${file.uri}/${filePath}`), { recursive: true })
          .then(() => fsPromises.writeFile(`${file.uri}/${filePath}`, ''))
      )
    );
  }

  return file;
}

module.exports = { handleFileSystem };
