const getAssignable = require('./getAssignable');
const getRole = require('../roles/getRole');

module.exports = async function findAssignableByAssetIds(assets, { userSession, transacting }) {
  // EN: Get the details of each assignable (if no permissions, don't return it)
  // ES: Obtiene los detalles de cada asignable (si no tiene permisos, no lo devuelve)
  return (
    await Promise.all(
      assets.map(async ({ id, category }) => {
        try {
          const assignable = await getAssignable.call({ calledFrom: 'plugins.assignables' }, id, {
            columns: [],
            userSession,
            transacting,
          });

          // 'assignables.'.length = 12
          let role = category.key.substring(12, category.key.length);

          role = await getRole.call({ calledFrom: 'plugins.assignables' }, role, { transacting });

          return { ...assignable, componentOwner: role.componentOwner };
        } catch (e) {
          return null;
        }
      })
    )
  ).filter((a) => a);
};
