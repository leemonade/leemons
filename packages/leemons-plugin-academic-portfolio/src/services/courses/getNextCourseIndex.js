const { table } = require('../tables');

async function getNextCourseIndex(program, { transacting } = {}) {
  const config = await table.configs.findOne(
    { key: `program-${program}-course-index` },
    { transacting }
  );
  if (!config) return 1;
  return parseInt(config.value, 10) + 1;
}

module.exports = { getNextCourseIndex };
