const getSubjects = require('../subjects/getSubjects');
const removeSubjects = require('../subjects/removeSubjects');
const { assignables: table } = require('../tables');
const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');

module.exports = async function removeAssignables(assignables, { transacting: t }) {
  return global.utils.withTransaction(
    async (transacting) => {
      await Promise.all(
        assignables.map(async (assignable) => {
          // EN: Get the assignable to validate ownership.
          // ES: Obtiene el asignable para validar la propiedad.
          await getAssignable.call(this, assignable, { transacting });

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
