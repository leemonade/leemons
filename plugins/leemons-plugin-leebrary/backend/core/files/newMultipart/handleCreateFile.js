/**
 * Creates a new file with the provided data and paths information.
 *
 * @param {Object} params - The parameters for creating a file.
 * @param {LibraryFile} params.fileData - The data for the new file.
 * @param {Object} params.pathsInfo - The paths information for the new file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryFile>} A promise that resolves with the created file.
 */
async function handleCreateFile({ fileData, pathsInfo, ctx }) {
  const result = await ctx.tx.db.Files.create({
    ...fileData,
    provider: 'sys',
    uri: '',
    metadata: JSON.stringify({ pathsInfo }),
  });
  return result.toObject();
}

module.exports = { handleCreateFile };
