/* eslint-disable no-param-reassign */
const mime = require('mime-types');
const { findOne: getSettings } = require('../../settings');
const { handleFileProvider } = require('./handleFileProvider');
const { getMetadataObject } = require('./getMetadataObject');

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
  // GET METADATA
  const { path, type } = file;
  const extension = mime.extension(type);
  const { metadata, fileSize } = await getMetadataObject({
    filePath: path,
    fileType: type,
    extension,
  });

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
