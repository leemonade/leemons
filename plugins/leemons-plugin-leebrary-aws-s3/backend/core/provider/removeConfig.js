/**
 * This function removes a configuration object from the database
 *
 * @param {Object} params - The parameters object.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database and to get the AWS S3 configuration.
 * @returns {Promise<boolean>} - Returns true if the file is successfully removed, otherwise throws an error.
 */
async function removeConfig({ ctx } = {}) {
  const configs = await ctx.tx.db.Config.find({}).lean();
  if (configs.length > 0) {
    await ctx.tx.db.Config.deleteOne({ id: configs[0].id });
  }
  return null;
}

module.exports = { removeConfig };
