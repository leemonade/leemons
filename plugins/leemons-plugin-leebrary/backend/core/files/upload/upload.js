/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const fsPromises = require('fs/promises');
const { findOne: getSettings } = require('../../settings');
const { handleMetadata } = require('./handleMetadata');
const { handleFileProvider } = require('./handleFileProvider');
const { handleDocumentInfo } = require('./handleDocumentInfo');
const { handleMediaInfo } = require('./handleMediaInfo');

/**
 * Uploads a file.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file to upload.
 * @param {string} params.name - The name of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<Object>} The uploaded file.
 */
async function upload({ file, name, ctx }) {
  const { path, type } = file;
  const extension = mime.extension(type);
  const fileHandle = await fsPromises.open(path, 'r');
  const [fileType] = type.split('/');

  // eslint-disable-next-line prefer-const
  let { metadata, fileSize } = await handleMetadata({ fileHandle, path });

  // ·········································································
  // MEDIAINFO
  metadata = await handleMediaInfo({ metadata, fileHandle, fileType, fileSize, ctx });

  // ·········································································
  // DOCUMENT INFO
  metadata = await handleDocumentInfo({ metadata, path, extension });

  // ·········································································
  // CREATE NEW FILE IN DB
  const fileData = {
    provider: 'sys',
    name,
    type,
    extension,
    uri: '',
    size: fileSize,
    metadata: JSON.stringify(metadata),
  };

  // EN: Firstly save the file to the database and get the id
  // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
  let newFile = await ctx.tx.db.Files.create(fileData).then((mongooseObj) =>
    mongooseObj.toObject()
  );

  // ·········································································
  // UPLOAD THE FILE

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const settings = await getSettings({ ctx });
  const urlData = await handleFileProvider({ newFile, settings, path, ctx });

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await ctx.tx.db.Files.findOneAndUpdate({ id: newFile.id }, urlData, {
    new: true,
    lean: true,
  });

  return { ...newFile, metadata };
}

module.exports = { upload };
