const getSubjects = require('../subjects/getSubjects');
const removeSubjects = require('../subjects/removeSubjects');
const { assignables: table } = require('../tables');
const versionControl = require('../versionControl');

module.exports = async function removeAssignables(assignables, { transacting: t }) {
  return global.utils.withTransaction(
    async (transacting) => {
      await Promise.all(
        assignables.map(async (assignable) => {
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
