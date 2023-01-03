const versionControl = require('../versionControl');
const removeAssignables = require('./removeAssignables');

module.exports = async function removeAssignable(
  assignable,
  { userSession, removeAll = 2, transacting } = {}
) {
  const version = await versionControl.getVersion(assignable, { transacting });

  const isPublished = version.published;

  if (removeAll === 0) {
    // EN: Remove the assignable provided version.
    // ES: Elimina la versión del asignable.
    return removeAssignables.call(this, [assignable], { userSession, transacting });
  }

  if (removeAll === 1 || removeAll === 2) {
    /*
      EN: Remove the all the versions of the assignable based on removeAll
        1: Remove the versions in the same publish state
        2: Remove all the versions

      ES: Elimina todas las versiones del asignable basado en removeAll
        1: Elimina las versiones en el mismo estado de publicación
        2: Elimina todas las versiones
    */
    const versions = (
      await versionControl.listVersions(assignable, {
        published: removeAll === 1 ? isPublished : 'all',
        transacting,
      })
    ).map((v) => v.fullId);

    const result = await removeAssignables.call(this, versions, { userSession, transacting });
    return {
      ...result,
      versions,
    };
  }

  throw new Error('Invalid removeAll value');
};
