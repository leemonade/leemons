const upgradeVersion = require('../helpers/upgradeVersion');
const { tasksVersions, tasksVersioning } = require('../../table');
const parseId = require('../helpers/parseId');
const versionExists = require('./exists');
const parseVersion = require('../helpers/parseVersion');

module.exports = async function createVersion(taskInfo, { transacting } = {}) {
  try {
    const defaultTaskInfo = {
      current: '0.0.0',
      last: '1.0.0',
    };

    const version = parseVersion(defaultTaskInfo.last);

    // EN: Create the task versioning instance
    // ES: Crear instancia de versionamiento de tarea
    const task = await tasksVersioning.create(
      {
        ...taskInfo,
        ...defaultTaskInfo,
      },
      { transacting }
    );

    const { id } = task;

    // EN: Create the task version instance
    // ES: Crear instancia de version de tarea
    await tasksVersions.create(
      {
        task: id,
        ...version,
        status: 'draft',
      },
      { transacting }
    );

    return task;
  } catch (e) {
    throw new Error(`Error creating task: ${e.message}`);
  }
};
