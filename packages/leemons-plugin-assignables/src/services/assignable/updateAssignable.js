const _ = require('lodash');
const { validateAssignable } = require('../../helpers/validators/assignable');
const updateSubjects = require('../subjects/updateSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const addUserToAssignable = require('./addUserToAssignable');
const createAssignable = require('./createAssignable');
const getAssignable = require('./getAssignable');
const listAssignableUserAgents = require('./listAssignableUserAgents');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');

function getDiff(a, b) {
  const _a = _.defaults(_.cloneDeep(a), b);

  if (_.isEqual(_a, b)) {
    return { object: _a, diff: [] };
  }

  return {
    object: _a,
    diff: _.differenceWith(Object.entries(_a), Object.entries(b), _.isEqual).map(([key]) => key),
  };
}

module.exports = async function updateAssignable(assignable, { userSession, transacting } = {}) {
  const { id, ...assignableObject } = assignable;
  let shouldUpgrade = false;

  if (_.isEmpty(assignable)) {
    throw new Error('No changes detected');
  }

  validateAssignable(assignableObject);

  // EN: Get the current values
  // ES: Obtenemos los valores actuales
  const currentAssignable = await getAssignable.call(this, id, { userSession, transacting });

  // EN: Check if the user has permission to update the assignable.
  // ES: Comprueba si el usuario tiene permiso para actualizar el asignable.
  const { actions } = await getUserPermission(currentAssignable, { userSession, transacting });

  if (!actions.includes('edit')) {
    throw new Error('You do not have permission to update this assignable.');
  }

  // EN: Diff the current values with the new ones
  // ES: Compara los valores actuales con los nuevos
  const { object, diff } = getDiff(assignableObject, currentAssignable);

  if (!diff.length) {
    throw new Error('No changes detected');
  }

  // EN: Check if the current version is published.
  // ES: Comprueba si la versión actual está publicada.
  const currentVersion = await versionControl.getVersion(id, { transacting });

  if (currentVersion.published) {
    shouldUpgrade = true;
  }

  // EN: Update the version.
  // ES: Actualiza la versión.
  if (shouldUpgrade) {
    // TODO: Let the user decide which upgrade scale to use.
    const { fullId } = await versionControl.upgradeVersion(id, 'major', {
      transacting,
    });

    // TODO: Duplicate everything and apply changes
    // TODO: Ensure to keep original owner
    const newAssignable = await createAssignable.call(this, _.omit(object, ['published', 'id']), {
      id: fullId,
      userSession,
      transacting,
    });

    // EN: Get the users that have access to the assignable.
    // ES: Obtiene los usuarios que tienen acceso al asignable.
    const users = await listAssignableUserAgents.call(this, id, { userSession, transacting });

    const userAgents = userSession.userAgents.map((u) => u.id);

    // EN: Add the permissions to the users.
    // ES: Añade los permisos a los usuarios.
    await Promise.all(
      users
        .filter((user) => !userAgents.includes(user.userAgent))
        .map((user) =>
          addUserToAssignable.call(this, fullId, user.userAgent, user.role, {
            userSession,
            transacting,
          })
        )
    );

    return {
      ...newAssignable,
      published: false,
    };
  }
  // EN: Update the assignable.
  // ES: Actualizar el asignable.

  if (diff.includes('subjects')) {
    const subjects = await updateSubjects(id, object.subjects, { transacting });

    object.subjects = subjects;
  }

  if (!_.difference(diff, ['subjects']).length) {
    return { id, ...object };
  }

  const updateObject = _.omit(_.pick(assignableObject, diff), ['subjects']);

  if (diff.includes('submission')) {
    updateObject.submission = JSON.stringify(assignableObject.submission);
  }

  if (diff.includes('metadata')) {
    updateObject.metadata = JSON.stringify(assignableObject.metadata);
  }

  await assignables.update({ id }, updateObject, {
    transacting,
  });

  return { id, ...object };
};
