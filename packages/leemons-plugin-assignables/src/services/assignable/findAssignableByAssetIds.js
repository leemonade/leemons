const { map } = require('lodash');
const getAssignables = require('./getAssignables');

module.exports = async function findAssignableByAssetIds(
  assets,
  { userSession, transacting, deleted }
) {
  // EN: Get the details of each assignable (if no permissions, don't return it)
  // ES: Obtiene los detalles de cada asignable (si no tiene permisos, no lo devuelve)

  const assetIds = map(assets, 'id');
  const assignables = await getAssignables(assetIds, {
    columns: [],
    deleted,
    userSession,
    transacting,
    throwOnMissing: false,
  });

  return assignables;
};
