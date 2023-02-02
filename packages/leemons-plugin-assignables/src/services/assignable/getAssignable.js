const _ = require('lodash');
const getRole = require('../roles/getRole');
const getSubjects = require('../subjects/getSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');
const getAsset = require('../leebrary/assets/getAsset');

module.exports = async function getAssignable(
  _id,
  {
    userSession,
    columns = ['asset'],
    withFiles,
    checkPermissions,
    transacting,
    deleted: showDeleted = true,
  } = {}
) {
  let isPublished = false;
  let id = _id;

  try {
    // TODO: Let the user decide which columns to get

    // EN: Get the assignable.
    // ES: Obtiene el asignable.
    // eslint-disable-next-line prefer-const
    const query = {
      $or: [
        {
          id,
        },
        {
          asset: id,
        },
      ],
    };

    if (showDeleted) {
      query.deleted_$null = false;
    }

    let assignable = await assignables.findOne(query, { transacting });

    id = assignable.id;

    // EN: Check if the current version is published.
    // ES: Comprueba si la versión actual está publicada.
    const version = await versionControl.getVersion(id, { transacting });

    isPublished = version.published;

    // EN: Get the role for checking the role ownership.
    // ES: Obtiene el rol para comprobar la propiedad del rol.
    const role = await getRole.call(this, assignable.role, { transacting });
    assignable.roleDetails = role;

    const subjects = await getSubjects(id, { transacting });

    // EN: Get the asset data
    // ES: Obtiene los datos del asset
    if (columns.includes('asset')) {
      assignable.asset = _.omit(
        await getAsset(assignable.asset, { userSession, withFiles, checkPermissions, transacting }),
        ['providerData']
      );
    }

    // EN: Parse objects.
    // ES: Parsear objetos.
    assignable = {
      ...assignable,
      gradable: Boolean(assignable.gradable),
      relatedAssignables: JSON.parse(assignable.relatedAssignables),
      submission: JSON.parse(assignable.submission),
      metadata: JSON.parse(assignable.metadata),
      resources: JSON.parse(assignable.resources) || [],
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
    e.messasge = `The assignable ${id} does not exist or you don't have access to it.`;

    throw e;
  }
};
