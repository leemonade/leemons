const deleteBreaks = require('./breakes/delete');
const get = require('./get');

module.exports = async function deleteConfig({ entitiesObj, ctx }) {
  // Get the config object
  const config = await get({ entitiesObj, ctx });

  if (!config) {
    return false;
  }

  // Delete related breaks
  await deleteBreaks({ configId: config.id, ctx });

  // Delete config
  await ctx.tx.db.Config.deleteOne({ id: config.id });
  return true;
};
