const pathSys = require('path');
const { isEmpty } = require('lodash');
const fsPromises = require('fs/promises');
const { getByName } = require('../../providers/getByName');
/**
 * Handles the file provider for file upload.
 *
 * @param {Object} params - The parameters for the file provider.
 * @param {Object} params.newFile - The new file to be uploaded.
 * @param {Object} params.settings - The settings for the file provider.
 * @param {string} params.path - The path of the file.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} The URL data of the uploaded file.
 */
async function handleFileProvider({ newFile, settings, path, ctx }) {
  const urlData = {};

  if (settings?.providerName) {
    const provider = await getByName({ name: settings.providerName, ctx });
    if (provider.supportedMethods?.upload) {
      const buffer = await fsPromises.readFile(path);
      urlData.provider = settings.providerName;
      urlData.uri = await ctx.tx.call(`${provider.pluginName}.files.upload`, {
        item: newFile,
        buffer,
      });
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto
  if (isEmpty(urlData.uri)) {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    urlData.provider = 'sys';
    urlData.uri = pathSys.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'files',
      `${newFile.id}.${newFile.extension}`
    );

    const buffer = await fsPromises.readFile(path);
    await fsPromises.writeFile(urlData.uri, buffer);
  }

  return urlData;
}

module.exports = { handleFileProvider };
