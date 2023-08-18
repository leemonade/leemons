const { tasksVersions } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function countVersion(task, { transacting } = {}) {
  const { id } = await parseId(task);

  const count = await tasksVersions.count(
    {
      task: id,
    },
    { transacting }
  );

  return count;
};
