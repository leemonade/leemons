const upgradeVersion = require('../helpers/upgradeVersion');
const { tasksVersions, tasksVersioning } = require('../../table');
const parseId = require('../helpers/parseId');
const versionExists = require('./exists');
const parseVersion = require('../helpers/parseVersion');

module.exports = async function upgradeTaskVersion(task, level = 'major', { transacting } = {}) {
  try {
    const { id, version } = await parseId(task, null, { transacting });
    // EN: Get the new version of the task.
    // ES: Obtener la nueva versión de la tarea.
    const newVersion = upgradeVersion(version, level);
    const { major, minor, patch } = parseVersion(newVersion);

    // EN: Get the new fullId
    // ES: Obtener la nueva id completa
    const { fullId } = await parseId(id, newVersion);

    // EN: Check if the version already exists.
    // ES: Comprobar si la versión ya existe.
    if (await versionExists(fullId, { transacting })) {
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

    await tasksVersioning.set({ id }, { last: newVersion }, { transacting });

    return parseId(id, newVersion);
  } catch (e) {
    throw new Error(`Error creating task ${task}: ${e.message}`);
  }
};
