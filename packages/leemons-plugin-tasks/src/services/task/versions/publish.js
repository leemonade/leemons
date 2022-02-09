const { tasksVersions, tasksVersioning } = require('../../table');
const get = require('./get');
const parseId = require('../helpers/parseId');

module.exports = async function publishVersion(taskId, { setCurrent = false, transacting } = {}) {
  const { id, version, fullId } = await parseId(taskId, null, { transacting });

  const task = await get(fullId, { transacting });

  if (!task) {
    throw new Error(`Task ${task} does not exist`);
  }

  if (task.status === 'published') {
    throw new Error(`Task ${task} is already published`);
  }

  await tasksVersions.set({ id: task.id }, { status: 'published' });

  if (setCurrent) {
    await tasksVersioning.set({ id }, { current: version });
  }
};
