const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Clones the file using the provider's clone service.
 *
 * @param {Object} params - The parameters object.
 * @param {LibraryFile} params.fromFile - The original file object.
 * @param {String} params.providerName - The name of the provider.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryFile|null>} The updated file object.
 */
async function handleCloneFile({ fromFile, providerName, ctx }) {
  const provider = await getProviderByName(providerName);
  const urlData = {};
  let newFile = null;
  if (provider?.supportedMethods?.clone) {
    // EN: Firstly save the file to the database and get the id
    // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
    newFile = await ctx.tx.db.Files.create({ ...fromFile, id: undefined, _id: undefined });
    urlData.provider = providerName;
    urlData.uri = await ctx.tx.call(`${providerName}.files.clone`, { fromFile, newFile });
    newFile = await ctx.tx.db.Files.updateOne({ id: newFile.id }, urlData);
  }
  return newFile;
}

module.exports = { handleCloneFile };
