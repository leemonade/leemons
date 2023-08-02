const { table } = require('../tables');
const { getNextCourseIndex } = require('./getNextCourseIndex');

async function addNextCourseIndex(program, { index, transacting } = {}) {
  let goodIndex = index;
  if (!index) {
    goodIndex = await getNextCourseIndex(program, { transacting });
  }
  await table.configs.set(
    { key: `program-${program}-course-index` },
    { key: `program-${program}-course-index`, value: goodIndex.toString() },
    { transacting }
  );
  return goodIndex;
}

module.exports = { addNextCourseIndex };
