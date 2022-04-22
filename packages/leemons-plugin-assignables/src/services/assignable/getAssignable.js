const getRole = require('../roles/getRole');
const getSubjects = require('../subjects/getSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');

module.exports = async function getAssignable(id, { userSession, transacting } = {}) {
  let isPublished = false;

  try {
    // EN: Check if the current version is published.
    // ES: Comprueba si la versión actual está publicada.
    const version = await versionControl.getVersion(id, { transacting });

    isPublished = version.published;

    // TODO: Let the user decide which columns to get

    // EN: Get the assignable.
    // ES: Obtiene el asignable.
    // eslint-disable-next-line prefer-const
    let { deleted, ...assignable } = await assignables.findOne(
      {
        id,
      },
      { transacting }
    );

    // EN: Get the role for checking the role ownership.
    // ES: Obtiene el rol para comprobar la propiedad del rol.
    await getRole.call(this, assignable.role, { transacting });

    const subjects = await getSubjects(id, { transacting });

    // EN: Parse objects.
    // ES: Parsear objetos.
    assignable = {
      ...assignable,
      gradable: Boolean(assignable.gradable),
      submission: JSON.parse(assignable.submission),
      metadata: JSON.parse(assignable.metadata),
      subjects,
    };

    // EN: Check if the user has permissions to view the assignable.
    // ES: Comprueba si el usuario tiene permisos para ver el asignable.
    const { actions } = await getUserPermission(assignable, { userSession, transacting });
    if (!actions.includes('view')) {
      throw new Error('You do not have permission to view this assignable.');
    }

    return {
      ...assignable,
      published: isPublished,
    };
  } catch (e) {
    throw new Error(`The assignable ${id} does not exist or you don't have access to it.`);
  }
};
