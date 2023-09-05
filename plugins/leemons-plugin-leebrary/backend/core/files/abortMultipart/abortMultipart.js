const { handleAbortMultipart } = require('./handleAbortMultipart');

/**
 * Aborts a multipart upload and deletes the file from the database.
 *
 * @param {Object} params - The parameters for the abort operation.
 * @param {Object} params.data - The data object containing the file ID.
 * @param {string} params.data.fileId - The ID of the file to be aborted and deleted.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns true if the abort operation and file deletion were successful.
 */
async function abortMultipart({ data: { fileId }, ctx }) {
  // Fetches the file from the database.
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new Error('No file found');

  await handleAbortMultipart({ file, ctx });

  // Deletes the file from the database.
  await ctx.tx.db.Files.deleteMany({ id: file.id });

  return true;
}

module.exports = { abortMultipart };
