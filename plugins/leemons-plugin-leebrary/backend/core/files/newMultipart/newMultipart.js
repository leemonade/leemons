const mime = require('mime-types');
const { isEmpty } = require('lodash');
const { handleCreateFile } = require('./handleCreateFile');
const { handleFileProvider } = require('./handleFileProvider');
const { handleFileSystem } = require('./handleFileSystem');
const { findOne: getSettings } = require('../../settings');

/**
 * Creates a new multipart file with the provided file information and transaction details.
 *
 * @param {Object} params - The params object
 * @param {string} params.name - The name of the file.
 * @param {string} params.type - The type of the file.
 * @param {number} params.size - The size of the file.
 * @param {boolean} params.isFolder - Indicates if the file is a folder.
 * @param {Array} params.filePaths - The paths of the file.
 * @param {Object} params.pathsInfo - The paths information for the new file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryFile>} A promise that resolves with the new multipart file.
 */
async function newMultipart({
  name,
  type,
  size,
  isFolder,
  filePaths,
  pathsInfo,
  copyright,
  externalUrl,
  ctx,
}) {
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
    handleCreateFile({ fileData, pathsInfo, ctx }),
    getSettings({ ctx }),
  ]);

  if (settings?.providerName) {
    file = await handleFileProvider({ file, filePaths, settings, ctx });
  }

  if (isEmpty(file.uri)) {
    file = await handleFileSystem({ file, filePaths });
  }

  // Add copyright and externalUrl to the file when provided by third party providers
  const updateData = { ...file };
  if (copyright) updateData.copyright = JSON.parse(copyright);
  if (externalUrl) updateData.externalUrl = externalUrl;

  await ctx.tx.db.Files.updateOne({ id: file.id }, updateData);

  return file;
}

module.exports = { newMultipart };
