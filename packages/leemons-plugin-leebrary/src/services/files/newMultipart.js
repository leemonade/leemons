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
 * Create a new file or directory.
 * @async
 * @param {Object} fileData - The file data.
 * @param {string} fileData.name - The name of the file.
 * @param {string} fileData.type - The type of the file.
 * @param {number} fileData.size - The size of the file.
 * @param {boolean} fileData.isFolder - Whether the file is a folder.
 * @param {Array} fileData.filePaths - The paths of the file.
 * @param {Object} fileData.pathsInfo - The information of the paths.
 * @param {Object} options - The options for creating the file.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The updated file data.
 */
async function newMultipart(
  { name, type, size, isFolder, filePaths, pathsInfo },
  { transacting } = {}
) {
  const extension = mime.extension(type);

  const [file, settings] = await createFileAndFetchSettings(name, type, extension, size, isFolder, pathsInfo, transacting);

  if (settings?.providerName) {
    await updateFileWithProvider(file, settings, filePaths, transacting);
  }

  if (isEmpty(file.uri)) {
    await updateFileWithSystem(file, isFolder, filePaths);
  }

  return tables.files.update({ id: file.id }, file, { transacting });
}

/**
 * Create a new file and fetch settings.
 * @async
 * @param {string} name - The name of the file.
 * @param {string} type - The type of the file.
 * @param {string} extension - The extension of the file.
 * @param {number} size - The size of the file.
 * @param {boolean} isFolder - Whether the file is a folder.
 * @param {Object} pathsInfo - The information of the paths.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Array>} The file and settings.
 */
async function createFileAndFetchSettings(name, type, extension, size, isFolder, pathsInfo, transacting) {
  return Promise.all([
    tables.files.create(
      {
        name,
        type,
        extension,
        size,
        isFolder,
        provider: 'sys',
        uri: '',
        metadata: JSON.stringify({ pathsInfo }),
      },
      { transacting }
    ),
    getSettings({ transacting }),
  ]);
}

/**
 * Update the file with the provider.
 * @async
 * @param {Object} file - The file data.
 * @param {Object} settings - The settings.
 * @param {Array} filePaths - The paths of the file.
 * @param {Promise<Object>} transacting - The transaction object.
 */
async function updateFileWithProvider(file, settings, filePaths, transacting) {
  const provider = leemons.getProvider(settings.providerName);
  file.provider = settings.providerName;
  if (provider?.services?.provider?.newMultipart) {
    file.uri = await provider.services.provider.newMultipart(file, { filePaths, transacting });
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Update the file with the system.
 * @async
 * @param {Object} file - The file data.
 * @param {boolean} isFolder - Whether the file is a folder.
 * @param {Promise<Array>} filePaths - The paths of the file.
 */
async function updateFileWithSystem(file, isFolder, filePaths) {
  file.provider = 'sys';
  if (!isFolder) {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}.${file.extension}`);
    await fsPromises.writeFile(file.uri, '');
  } else {
    file.uri = path.resolve(__dirname, '..', '..', '..', 'files', `${file.id}`);
    for (let i = 0; i < filePaths.length; i++) {
      await fsPromises.mkdir(path.dirname(`${file.uri}/${filePaths[i]}`), { recursive: true });
      await fsPromises.writeFile(`${file.uri}/${filePaths[i]}`, '');
    }
  }
}

module.exports = { newMultipart };
