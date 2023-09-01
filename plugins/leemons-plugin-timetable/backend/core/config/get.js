const entitiesFormat = require('../helpers/config/entitiesFormat');
const getBreaks = require('./breakes/get');

module.exports = async function get({ entitiesObj, ctx }) {
  const { entities, entityTypes } = entitiesFormat({ entitiesObj, ctx });
  // Get the entity's config
  const config = await ctx.tx.db.Config.findOne({ entities, entityTypes }).lean();
  if (config) {
    // Get the entity's breaks
    const breaks = await getBreaks({ configId: config.id, ctx });
    config.days = config.days.split(',');
    return { ...config, breaks };
  }
  return null;
};
