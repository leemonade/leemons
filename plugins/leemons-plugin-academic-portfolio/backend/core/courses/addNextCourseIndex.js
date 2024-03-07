const { getNextCourseIndex } = require('./getNextCourseIndex');

async function addNextCourseIndex({ program, index, ctx }) {
  let goodIndex = index;
  if (!index) {
    goodIndex = await getNextCourseIndex({ program, ctx });
  }
  await ctx.tx.db.Configs.updateOne(
    { key: `program-${program}-course-index` },
    { key: `program-${program}-course-index`, value: goodIndex.toString() },
    { upsert: true }
  );
  return goodIndex;
}

module.exports = { addNextCourseIndex };
