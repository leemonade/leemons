const { tasksVersions } = require('../../table');
const parseId = require('../helpers/parseId');
const parseVersion = require('../helpers/parseVersion');

module.exports = async function existsVersion(task, { transacting } = {}) {
  const { id, version } = await parseId(task);
  const { major, minor, patch } = parseVersion(version);

  const count = await tasksVersions.count(
    {
      task: id,
      major,
      minor,
      patch,
    },
    { transacting }
  );

  return count > 0;
};
