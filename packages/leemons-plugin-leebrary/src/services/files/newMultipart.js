/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { isEmpty } = require('lodash');
const path = require('path');
const fsPromises = require('fs/promises');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Creates a new file with the provided data and paths information.
 *
 * @param {Object} params - The parameters for creating a file.
 * @param {Object} params.fileData - The data for the new file.
 * @param {Object} params.pathsInfo - The paths information for the new file.
 * @param {Object} params.transacting - The transaction object for database operations.
 * @returns {Promise<Object>} A promise that resolves with the created file.
 */
async function createFile({ fileData, pathsInfo, transacting }) {
  return tables.files.create(
    {
      ...fileData,
      provider: 'sys',
      uri: '',
      metadata: JSON.stringify({ pathsInfo }),
    },
    { transacting }
  );
}

/**
 * Handles the file provider for the given file. If the provider supports multipart operations,
 * it delegates the operation to the provider's newMultipart method.
 *
 * @param {Object} params - The parameters for handling the file provider.
 * @param {Object} params.file - The file to handle.
 * @param {Array} params.filePaths - The paths of the file.
 * @param {Object} params.settings - The settings for the file provider.
 * @param {Object} params.transacting - The transaction object for database operations.
 * @returns {Promise<Object>} A promise that resolves with the handled file.
 */
async function handleFileProvider({ file, filePaths, settings, transacting }) {
  const provider = leemons.getProvider(settings.providerName);
  file.provider = settings.providerName;
  if (provider?.services?.provider?.newMultipart) {
    file.uri = await provider.services.provider.newMultipart(file, { filePaths, transacting });
  }

  return file;
}

/**
 * Handles the file system for the given file.
 * If the file is not a folder, it writes an empty file to the file's URI.
 * If the file is a folder, it creates directories for each file path and writes an empty file to each path.
 *
 * @param {Object} params - The parameters for handling the file system.
 * @param {Object} params.file - The file to handle.
 * @param {Array} params.filePaths - The paths of the file.
 * @returns {Promise<Object>} A promise that resolves with the handled file.
 */
async function handleFileSystem({ file, filePaths }) {
  file.provider = 'sys';

  if (!file.isFolder) {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}.${file.extension}`);
    await fsPromises.writeFile(file.uri, '');
  } else {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}`);
    for (let i = 0; i < filePaths.length; i++) {
      await fsPromises.mkdir(path.dirname(`${file.uri}/${filePaths[i]}`), { recursive: true });
      await fsPromises.writeFile(`${file.uri}/${filePaths[i]}`, '');
    }
  }

  return file;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Creates a new multipart file with the provided file information and transaction details.
 *
 * @param {Object} fileData - The file information.
 * @param {string} fileData.name - The name of the file.
 * @param {string} fileData.type - The type of the file.
 * @param {number} fileData.size - The size of the file.
 * @param {boolean} fileData.isFolder - Indicates if the file is a folder.
 * @param {Array} fileData.filePaths - The paths of the file.
 * @param {Object} fileData.pathsInfo - The paths information for the new file.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object for database operations.
 * @returns {Promise<Object>} A promise that resolves with the new multipart file.
 */
async function newMultipart(
  { name, type, size, isFolder, filePaths, pathsInfo },
  { transacting } = {}
) {
  const extension = mime.extension(type);
  const fileData = {
    name,
    type,
    extension,
    size,
    isFolder,
  };
  // eslint-disable-next-line prefer-const
  let [file, settings] = await Promise.all([
    createFile({ fileData, pathsInfo, transacting }),
    getSettings({ transacting }),
  ]);

  if (settings?.providerName) {
    file = await handleFileProvider({ file, filePaths, settings, transacting });
  }

  if (isEmpty(file.uri)) {
    file = await handleFileSystem({ file, filePaths });
  }

  return tables.files.update({ id: file.id }, file, { transacting });
}

module.exports = { newMultipart };
