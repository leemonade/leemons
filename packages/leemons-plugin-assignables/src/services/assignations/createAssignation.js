const _ = require('lodash');
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');

module.exports = async function createAssignation(
  assignableInstanceId,
  users,
  options,
  { userSession, transacting: t } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // EN: Get the assignable instance, if not permissions, it will throw an error
      // ES: Obtiene la instancia asignable, si no tiene permisos, lanzará un error
      await getAssignableInstance(assignableInstanceId, {
        userSession,
        transacting,
      });

      try {
        const { indexable, classes, group, grades, timestamps, status, metadata } = options;

        // EN: Create the assignation
        // ES: Crea la asignación
        return await Promise.all(
          users.map(async (user) => {
            const assignation = await assignations.create(
              {
                instance: assignableInstanceId,
                indexable: indexable || true,
                user,
                classes: JSON.stringify(classes || []),
                group,
                status,
                metadata: JSON.stringify(metadata),
              },
              { transacting }
            );

            // EN: Save the timestamps
            // ES: Guarda los timestamps
            if (!_.isEmpty(timestamps)) {
              assignation.timestamps = await registerDates(
                'assignation',
                assignation.id,
                timestamps,
                { transacting }
              );
            }

            // EN: Save the grades
            // ES: Guarda las calificaciones
            if (!_.isEmpty(grades)) {
              assignation.grades = await Promise.all(
                grades.map((grade) =>
                  registerGrade({ assignation: assignation.id, ...grade }, { transacting })
                )
              );
            }

            return assignation;
          })
        );
      } catch (e) {
        throw new Error(`Error creating assignation: ${e.message}`);
      }
    },
    assignations,
    t
  );
};
