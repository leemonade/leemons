const { tasksVersions, tasksVersioning } = require('../../table');
const parseId = require('../helpers/parseId');
const parseVersion = require('../helpers/parseVersion');
const count = require('./count');

module.exports = async function removeVersion(task, { transacting } = {}) {
  const { id, version } = await parseId(task);
  const { major, minor, patch } = parseVersion(version);

  const deleted = await tasksVersions.deleteMany(
    {
      task: id,
      major,
      minor,
      patch,
    },
    { transacting }
  );

  if (!(await count(task, { transacting }))) {
    await tasksVersioning.deleteMany({ id }, { transacting });
  }

  return deleted;
};
