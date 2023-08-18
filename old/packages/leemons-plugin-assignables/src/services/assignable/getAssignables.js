const _ = require('lodash');
const { map } = require('lodash');
const getSubjects = require('../subjects/getSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const getAsset = require('../leebrary/assets/getAsset');
const getUserPermissions = require('./permissions/assignable/users/getUserPermissions');
const getRoles = require('../roles/getRoles');

// TODO: Allow user to select fields

async function getAssignablesPublishState(ids, { transacting }) {
  const versions = await versionControl.getVersion(ids, { transacting });

  return Object.fromEntries(versions.map((version) => [version.fullId, version.published]));
}

async function getAssetData(assetsIds, { userSession, transacting, columns, withFiles }) {
  if (!columns.includes('asset')) {
    return {};
  }

  const assetsData = await getAsset(assetsIds, { userSession, transacting, withFiles });

  const assetsByIds = {};
  assetsData.forEach((asset) => {
    assetsByIds[asset.id] = _.omit(asset, ['providerData']);
  });

  return assetsByIds;
}

module.exports = async function getAssignables(
  ids,
  {
    columns = ['asset'],
    withFiles,
    deleted: showDeleted = true,
    throwOnMissing = true,
    userSession,
    transacting,
  }
) {
  try {
    // EN: First get the assignables (we need theirs ids for permissions)
    // ES: Primero obtenemos los assignables (necesitamos sus ids para los permisos)
    const query = {
      $or: [
        {
          id_$in: ids,
        },
        {
          asset_$in: ids,
        },
      ],
    };

    if (showDeleted) {
      query.deleted_$null = false;
    }

    let assignablesData = await assignables.find(query, { transacting });

    let assignablesFoundIds = map(assignablesData, 'id');
    let assetsIds = map(assignablesData, 'asset');

    // EN: Check all the requested assignables exists
    // ES: Comprobar que todos los assignables existen
    if (throwOnMissing && _.difference(ids, assignablesFoundIds.concat(assetsIds))?.length) {
      throw new Error(
        "You don't have permissions to see some of the requested assignables or they do not exist"
      );
    }
    // EN: Now we need to check the user has permissions to read the assignables
    // ES: Ahora necesitamos determinar si el usuario tiene permisos para verlos

    const permissions = await getUserPermissions(assignablesData, { userSession, transacting });
    if (
      throwOnMissing &&
      !Object.values(permissions).every((permission) => permission.actions.includes('view'))
    ) {
      throw new Error(
        "You don't have permissions to see some of the requested assignables or they do not exist"
      );
    } else {
      const missingAssignables = {};
      Object.entries(permissions).forEach(([assignable, permission]) => {
        if (!permission.actions.includes('view')) {
          missingAssignables[assignable] = true;
        }
      });

      if (Object.keys(missingAssignables).length) {
        assignablesData = assignablesData.filter(({ id }) => !missingAssignables[id]);
        assignablesFoundIds = map(assignablesData, 'id');
        assetsIds = map(assignablesData, 'asset');
      }
    }

    const promises = [];

    // EN: Get the publish state of all the assignables
    // ES: Obtener todos los estados de publicación de los asignables
    promises.push(getAssignablesPublishState(assignablesFoundIds, { transacting }));

    // EN: Get the role details of the assignables
    // ES: Obtener detalles de los roles de los asignables
    promises.push(getRoles(map(assignablesData, 'role')));

    // EN: Get the assignables subjects
    // ES: Obtener las asignaturas
    promises.push(getSubjects(assignablesFoundIds, { transacting }));

    // EN: Get the assets data if solicited
    // ES: Obtener los datos del asset si se ha pedido
    promises.push(getAssetData(assetsIds, { userSession, transacting, columns, withFiles }));

    const [publishState, roles, subjects, assetsData] = await Promise.all(promises);

    const returnValues = assignablesData.map((assignable) => ({
      ...assignable,
      published: publishState[assignable.id],
      roleDetails: roles[assignable.role],
      subjects: subjects[assignable.id] ?? [],
      asset: assetsData[assignable.asset] || assignable.asset,

      // EN: Parse database info
      // ES: Parsear info de la base de datos
      gradable: Boolean(assignable.gradable),
      relatedAssignables: JSON.parse(assignable.relatedAssignables),
      submission: JSON.parse(assignable.submission),
      metadata: JSON.parse(assignable.metadata),
      resources: JSON.parse(assignable.resources) || [],
    }));

    return returnValues;
  } catch (e) {
    throw new Error(`An error occurred while getting assignables`, { cause: e });
  }
};
