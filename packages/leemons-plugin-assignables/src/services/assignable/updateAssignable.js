const _ = require('lodash');
const updateAsset = require('../leebrary/assets/updateAsset');
const getDiff = require('../../helpers/getDiff');
const { validateAssignable } = require('../../helpers/validators/assignable');
const updateSubjects = require('../subjects/updateSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const addUserToAssignable = require('./addUserToAssignable');
const createAssignable = require('./createAssignable');
const getAssignable = require('./getAssignable');
const listAssignableUserAgents = require('./listAssignableUserAgents');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');
const publishAssignable = require('./publishAssignable');

const updatableFields = [
  'asset',
  // role,
  'gradable',
  'center',
  'subjects',
  'relatedAssignables',
  'methodology',
  'statement',
  'development',
  'duration',
  'submission',
  'instructionsForTeachers',
  'instructionsForStudents',
  'metadata',
];

module.exports = async function updateAssignable(
  assignable,
  { published = false, userSession, transacting } = {}
) {
  const { id, ...assignableObjectReceived } = assignable;

  const assignableObject = _.pick(assignableObjectReceived, updatableFields);

  let shouldUpgrade = false;

  if (_.isEmpty(assignableObject)) {
    throw new Error('No changes detected');
  }

  validateAssignable(_.omit(assignableObject, ['deleted']));

  // EN: Get the current values
  // ES: Obtenemos los valores actuales
  const currentAssignable = await getAssignable.call(this, id, { userSession, transacting });

  if (currentAssignable.deleted) {
    throw new Error('The assignable is deleted');
  }

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

  let assetId = currentAssignable.asset.id;

  const asset = await updateAsset(
    {
      ..._.defaults(object.asset, currentAssignable.asset),
      id: currentAssignable.asset.id,
    },
    {
      transacting,
      userSession,
      upgrade: true,
      published: false,
      scale: 'major',
    }
  );

  assetId = asset.id;

  // EN: Update the version.
  // ES: Actualiza la versión.
  if (shouldUpgrade) {
    // TODO: Let the user decide which upgrade scale to use.
    const { fullId } = await versionControl.upgradeVersion(id, 'major', {
      transacting,
    });

    // TODO: Duplicate everything and apply changes
    // TODO: Ensure to keep original owner
    const newAssignable = await createAssignable.call(
      this,
      _.omit({ ...object, asset: assetId }, ['published', 'id', 'roleDetails']),
      {
        id: fullId,
        userSession,
        transacting,
      }
    );

    // EN: Get the users that have access to the assignable.
    // ES: Obtiene los usuarios que tienen acceso al asignable.
    const users = await listAssignableUserAgents.call(this, id, { userSession, transacting });

    const userAgents = userSession.userAgents.map((u) => u.id);

    // EN: Add the permissions to the users.
    // ES: Añade los permisos a los usuarios.
    await Promise.all(
      users
        .filter((user) => !userAgents.includes(user.userAgent) && user.role !== 'student')
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

  const updateObject = { ..._.omit(_.pick(assignableObject, diff), ['subjects']), asset: assetId };

  if (diff.includes('submission')) {
    updateObject.submission = JSON.stringify(assignableObject.submission);
  }

  if (diff.includes('metadata')) {
    updateObject.metadata = JSON.stringify(assignableObject.metadata);
  }

  if (diff.includes('relatedAssignables')) {
    updateObject.relatedAssignables = JSON.stringify(assignableObject.relatedAssignables);

    if (
      updateObject.relatedAssignables?.before?.length ||
      updateObject.relatedAssignables?.after?.length
    ) {
      try {
        // EN: Check every assignable exists
        // ES: Comprueba que todos los asignables existan
        await Promise.all(
          _.concat(
            updateObject.relatedAssignables?.before,
            updateObject.relatedAssignables?.after
          ).map((a) => getAssignable.call(this, a.id, { userSession, transacting }))
        );
      } catch (e) {
        throw new Error(
          "Some of the related assignables don't exists or you don't have permissions to access them"
        );
      }
    }
  }
  await assignables.update({ id }, updateObject, {
    transacting,
  });

  if (published) {
    await publishAssignable.call(this, id, { userSession, transacting });
  }

  return {
    id,
    ...object,
    asset: {
      ...object.asset,
      id: assetId,
    },
    published,
  };
};
