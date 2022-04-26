const removeAsset = require('../leebrary/assets/removeAsset');
const getSubjects = require('../subjects/getSubjects');
const removeSubjects = require('../subjects/removeSubjects');
const { assignables: table } = require('../tables');
const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');
const listAssignableUserAgents = require('./listAssignableUserAgents');
const { removeAssignablePermission } = require('./permissions');
const removeUserFromAssignable = require('./removeUserFromAssignable');

module.exports = async function removeAssignables(assignables, { userSession, transacting: t }) {
  return global.utils.withTransaction(
    async (transacting) => {
      await Promise.all(
        assignables.map(async (assignable) => {
          // EN: Get the assignable to validate ownership.
          // ES: Obtiene el asignable para validar la propiedad.
          const a = await getAssignable.call(this, assignable, { userSession, transacting });

          // EN: Remove the asset.
          // ES: Elimina el activo.
          await removeAsset(a.asset.id, { userSession, transacting });

          // EN: Get the users that have access to the assignable.
          // ES: Obtiene los usuarios que tienen acceso al asignable.
          const userAgents = (
            await listAssignableUserAgents.call(this, assignable, {
              userSession,
              transacting,
            })
          ).map((u) => u.userAgent);

          // EN: Remove the users that have access to the assignable.
          // ES: Elimina los usuarios que tienen acceso al asignable.
          await removeUserFromAssignable.call(this, assignable, userAgents, {
            userSession,
            transacting,
          });

          // EN: Remove the permission
          // ES: Elimina el permiso
          await removeAssignablePermission(a, { transacting });

          // EN: Remove versions for each assignable
          // ES: Eliminar versiones para cada asignable
          await versionControl.unregister(assignable, 'version', { transacting });

          // EN: Remove subjects for each assignable
          // ES: Eliminar asignables para cada asignable
          const subjects = await getSubjects(assignable, { ids: true, transacting });
          return removeSubjects(
            subjects.map((s) => s.id),
            { transacting }
          );
        })
      );

      // EN: Remove assignables
      // ES: Eliminar asignables
      return table.deleteMany({ id_$in: assignables }, { transacting });
    },
    table,
    t
  );
};
