const { validateAssignable } = require('../../helpers/validators/assignable');
const getRole = require('../roles/getRole');
const saveSubjects = require('../subjects/saveSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');

module.exports = async function createAssignable(
  assignable,
  { id: _id = null, transacting: t } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let id = _id;

      validateAssignable(assignable);

      const { subjects, submission, metadata, ...assignableObject } = assignable;

      // EN: Check if the role exists
      // ES: Comprueba si el rol existe
      await getRole.call(this, assignable.role, { transacting });

      // EN: Register a new versioned entity.
      // ES: Registra una nueva versión de una entidad.
      if (!id) {
        const version = await versionControl.register('assignable', {
          transacting,
        });
        id = version.fullId;
      }

      // EN: Create the assignable for the given version.
      // ES: Crea el asignable para la versión dada.
      try {
        const assignableCreated = await assignables.create(
          {
            id,
            ...assignableObject,
            submission: JSON.stringify(submission),
            metadata: JSON.stringify(metadata),
          },
          { transacting }
        );

        // EN: Save the subjects for the given assignable.
        // ES: Guarda los asignables para la versión dada.
        await saveSubjects(assignableCreated.id, subjects, { transacting });

        return { id: assignableCreated.id, ...assignable };
      } catch (e) {
        throw new Error(`Failed to create assignable: ${e.message}`);
      }
    },
    assignables,
    t
  );
};
