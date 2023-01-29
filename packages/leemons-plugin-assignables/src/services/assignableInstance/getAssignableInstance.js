const { getDates } = require('../dates');
const getAssignable = require('../assignable/getAssignable');
const listAssignableInstanceClasses = require('../classes/listAssignableInstanceClasses');
const { assignableInstances } = require('../tables');
const getUserPermission = require('./permissions/assignableInstance/users/getUserPermission');
const getAssignationsOfAssignableInstance = require('../assignations/getAssignationsOfAssignableInstance');

module.exports = async function getAssignableInstance(
  id,
  { relatedAssignableInstances, details, userSession, transacting } = {}
) {
  try {
    let assignableInstance;
    let isTeacher;
    try {
      // EN: Check the user permissions
      // ES: Comprueba los permisos del usuario
      const permissions = await getUserPermission(id, { userSession, transacting });
      if (!permissions.actions.includes('view')) {
        throw new Error('You do not have permissions');
      }

      isTeacher = permissions.actions.includes('edit');

      // EN: Get the provided assignableInstance
      // ES: Obtiene el asignableInstance proporcionado
      assignableInstance = await assignableInstances.findOne({ id }, { transacting });

      assignableInstance.curriculum = JSON.parse(assignableInstance.curriculum);
      assignableInstance.metadata = JSON.parse(assignableInstance.metadata);
      assignableInstance.relatedAssignableInstances = JSON.parse(
        assignableInstance.relatedAssignableInstances
      );

      if (
        !isTeacher &&
        assignableInstance.metadata &&
        !assignableInstance.metadata?.showGroupNameToStudents
      ) {
        assignableInstance.metadata.groupName = undefined;
        assignableInstance.metadata.showGroupNameToStudents = undefined;
      }
    } catch (e) {
      console.error(e);
      throw new Error("The assignable instance doesn't exist or you don't have access");
    }

    // EN: Get the requested details
    // ES: Obtiene los detalles solicitados
    if (details) {
      // EN: Get the classes of the assignable instance
      // ES: Obtiene las clases del asignable instance
      try {
        assignableInstance.classes = (
          await listAssignableInstanceClasses.call(this, id, {
            userSession,
            transacting,
          })
        ).map((c) => c.class);
      } catch (e) {
        throw new Error(`Error getting the classes of the assignable instance: ${e.message}`);
      }

      // EN: Get the dates
      // ES: Obtiene las fechas
      try {
        assignableInstance.dates = await getDates('assignableInstance', id, { transacting });
      } catch (e) {
        throw new Error(`Error getting the dates of the assignable instance: ${e.message}`);
      }

      if (isTeacher) {
        try {
          assignableInstance.students = await getAssignationsOfAssignableInstance(id, {
            details: true,
            userSession,
            transacting,
          });
        } catch (e) {
          console.error(e);
          throw new Error(
            `Error getting the students data of the assignable instance: ${e.message}`
          );
        }
      }

      // EN: Get the assignable data
      // ES: Obtiene los datos del asignable
      try {
        assignableInstance.assignable = await getAssignable.call(
          this,
          assignableInstance.assignable,
          { userSession, transacting }
        );
      } catch (e) {
        throw new Error(`Error geting ${id} details: ${e.message}`);
      }
    }

    // EN: Get the related assignable instances
    // ES: Obtiene los asignable instances relacionados
    try {
      if (relatedAssignableInstances && assignableInstance.relatedAssignableInstances?.length) {
        assignableInstance.relatedAssignableInstances = await Promise.all(
          assignableInstance.relatedAssignableInstances.map(async (relatedAssignableInstance) =>
            getAssignableInstance.call(this, relatedAssignableInstance, {
              relatedAssignableInstances,
              details,
              userSession,
              transacting,
            })
          )
        );
      }
    } catch (e) {
      throw new Error('Error getting related assignable instances');
    }

    return assignableInstance;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
