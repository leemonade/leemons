const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Clones the file using the provider's clone service.
 *
 * @param {Object} params - The parameters object.
 * @param {LibraryFile} params.fromFile - The original file object.
 * @param {String} params.providerName - The name of the provider.
 * @param {String} params.toFolder - The folder where the item will be cloned. Default is 'leebrary'.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryFile|null>} The updated file object.
 */
async function handleCloneFile({ fromFile, providerName, toFolder = 'leebrary', ctx }) {
  const provider = await getProviderByName({ name: providerName, ctx });
  const urlData = {};
  let newFile = null;
  if (provider?.supportedMethods?.clone) {
    // EN: Firstly save the file to the database and get the id
    // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
    const toCreate = { ...fromFile, id: undefined, _id: undefined };
    delete toCreate.id;
    delete toCreate._id;

    newFile = await ctx.tx.db.Files.create(toCreate).then((doc) => doc.toObject());
    urlData.provider = providerName;
    urlData.uri = await ctx.tx.call(`${providerName}.files.clone`, {
      itemFrom: fromFile,
      itemTo: newFile,
      toFolder,
    });
    newFile = await ctx.tx.db.Files.findOneAndUpdate({ id: newFile.id }, urlData, {
      new: true,
      lean: true,
    });
  }
  return newFile;
}

module.exports = { handleCloneFile };
