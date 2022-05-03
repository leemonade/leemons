const _ = require('lodash');
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');
const addPermissionToUser = require('../assignableInstance/permissions/assignableInstance/users/addPermissionToUser');
const { validateAssignation } = require('../../helpers/validators/assignation');

module.exports = async function createAssignation(
  assignableInstanceId,
  users,
  options,
  { userSession, transacting: t } = {}
) {
  // TODO: Permissions like `task.${taskId}.instance.${instanceId}` to allow assignation removals and permissions changes
  return global.utils.withTransaction(
    async (transacting) => {
      validateAssignation(
        {
          instance: assignableInstanceId,
          users,
          ...options,
        },
        { useRequired: true }
      );

      // EN: Get the assignable instance, if not permissions, it will throw an error
      // ES: Obtiene la instancia asignable, si no tiene permisos, lanzará un error
      await getAssignableInstance.call(this, assignableInstanceId, {
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

            return {
              instance: assignableInstanceId,
              indexable,
              classes,
              group,
              grades,
              timestamps,
              status,
              metadata,
            };
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
