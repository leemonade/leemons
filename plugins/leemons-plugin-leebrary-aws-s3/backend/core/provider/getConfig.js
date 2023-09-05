/**
 * This function retrieves the first configuration object from the database.
 * If no configuration objects are found, it returns null.
 *
 * @param {Object} params - The parameters object.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Object|null} The first configuration object from the database, or null if no configurations are found.
 */
async function getConfig({ ctx }) {
  const configs = await ctx.tx.db.Config.find({}).lean();
  if (configs.length > 0) return configs[0];
  return null;
}

module.exports = { getConfig };
