const upgradeVersion = require('../helpers/upgradeVersion');
const { tasksVersions, tasksVersioning } = require('../../table');
const parseId = require('../helpers/parseId');
const versionExists = require('./exists');
const parseVersion = require('../helpers/parseVersion');

module.exports = async function upgradeVersion(task, level = 'major', { transacting } = {}) {
  try {
    const { id, version } = await parseId(task, null, { transacting });
    // EN: Get the new version of the task.
    // ES: Obtener la nueva versión de la tarea.
    const newVersion = upgradeVersion(version, level);
    const { major, minor, patch } = parseVersion(newVersion);

    // EN: Check if the version already exists.
    // ES: Comprobar si la versión ya existe.
    if (await versionExists(task, { transacting })) {
      throw new Error(`Version ${newVersion} already exists for task ${id}`);
    }

    await tasksVersions.create(
      {
        task: id,
        major,
        minor,
        patch,
        status: 'draft',
      },
      { transacting }
    );

    return true;
  } catch (e) {
    throw new Error(`Error creating task ${task}: ${e.message}`);
  }
};
