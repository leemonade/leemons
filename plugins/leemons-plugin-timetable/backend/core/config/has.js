const entitiesFormat = require('../helpers/config/entitiesFormat');

module.exports = async function has({ entitiesObj, ctx }) {
  const { entities, entityTypes } = entitiesFormat({ entitiesObj, ctx });

  const count = await ctx.tx.db.Config.countDocuments({ entities, entityTypes });
  return count > 0;
};
