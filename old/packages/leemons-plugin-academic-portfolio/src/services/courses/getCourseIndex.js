const { table } = require('../tables');

async function getCourseIndex(course, { transacting } = {}) {
  const { index } = await table.groups.findOne(
    { id: course, type: 'course' },
    { columns: ['id', 'index'], transacting }
  );
  return index;
}

module.exports = { getCourseIndex };
