const { validateAssignable } = require('../../helpers/validators/assignable');
const saveSubjects = require('../subjects/saveSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');

module.exports = async function createAssignable(assignable, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateAssignable(assignable);

      const { subjects, submission, metadata, ...assignableObject } = assignable;

      // EN: Register a new versioned entity.
      // ES: Registra una nueva versión de una entidad.
      const version = await versionControl.register('assignable', { transacting });

      // EN: Create the assignable for the given version.
      // ES: Crea el asignable para la versión dada.
      try {
        const assignableCreated = await assignables.create(
          {
            id: version.fullId,
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
