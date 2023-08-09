const { getNextGroupIndex } = require('./getNextGroupIndex');

async function addNextGroupIndex({ program, index, ctx }) {
  let goodIndex = index;
  if (!index) {
    goodIndex = await getNextGroupIndex({ program, ctx });
  }
  await ctx.tx.db.Configs.findOneAndUpdate(
    { key: `program-${program}-group-index` },
    { key: `program-${program}-group-index`, value: goodIndex.toString() },
    { upsert: true }
  );
  return goodIndex;
}

module.exports = { addNextGroupIndex };
