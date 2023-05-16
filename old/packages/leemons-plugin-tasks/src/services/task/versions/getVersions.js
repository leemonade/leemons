const { tasksVersions } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getVersions(task, { status, transacting } = {}) {
  const { id } = await parseId(task);

  const versions = await tasksVersions.find(
    {
      task: id,
      status,
    },
    { transacting }
  );

  return Promise.all(
    versions.map(async (version) => {
      const v = `${version.major}.${version.minor}.${version.patch}`;
      const { fullId } = await parseId(version.task, v);

      return {
        id: fullId,
        version: v,
        status: version.status,
      };
    })
  );
};
