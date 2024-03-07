const { configChanged } = require('./aws');
const { getClientCached, clearClient } = require('./awsClient');

async function setConfig({ data, ctx }) {
  let newConfig = null;
  const config = await ctx.tx.db.Config.findOne({}).lean();
  try {
    if (config) {
      newConfig = await ctx.tx.db.Config.findOneAndUpdate({ id: config.id }, data, {
        lean: true,
        new: true,
      });
    } else {
      newConfig = await ctx.tx.db.Config.create(data);
      newConfig = newConfig.toObject();
    }
    configChanged();
    clearClient();
    await getClientCached({ ctx });
    return newConfig;
  } catch (e) {
    configChanged();
    clearClient();
    if (config) {
      await ctx.tx.db.Config.findOneAndUpdate({ id: config.id }, config, { new: true, lean: true });
      await getClientCached({ ctx });
    } else {
      await ctx.tx.db.Config.deleteOne({ id: newConfig?.id });
    }
    throw e;
  }
}

module.exports = { setConfig };
