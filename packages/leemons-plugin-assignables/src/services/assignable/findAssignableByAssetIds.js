const getAssignable = require('./getAssignable');

module.exports = async function findAssignableByAssetIds(assets, { userSession, transacting }) {
  // EN: Get the details of each assignable (if no permissions, don't return it)
  // ES: Obtiene los detalles de cada asignable (si no tiene permisos, no lo devuelve)
  return (
    await Promise.all(
      assets.map(async ({ id }) => {
        try {
          const assignable = await getAssignable.call({ calledFrom: 'plugins.assignables' }, id, {
            columns: [],
            userSession,
            transacting,
          });

          // 'assignables.'.length = 12

          return { ...assignable };
        } catch (e) {
          return null;
        }
      })
    )
  ).filter((a) => a);
};
