const { tasksVersions } = require('../../table');
const parseId = require('../helpers/parseId');
const parseVersion = require('../helpers/parseVersion');

module.exports = async function getVersion(task, { transacting } = {}) {
  const { id, version } = await parseId(task);
  const { major, minor, patch } = parseVersion(version);

  const taskInfo = await tasksVersions.find(
    {
      task: id,
      major,
      minor,
      patch,
    },
    { transacting }
  );

  if (!taskInfo.length) {
    throw new Error("Task version doesn't exist");
  }

  return { ...taskInfo[0], version };
};
