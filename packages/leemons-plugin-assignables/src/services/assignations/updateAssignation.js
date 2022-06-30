const _ = require('lodash');
const { validateAssignation } = require('../../helpers/validators/assignation');
const updateDates = require('../dates/updateDates');
const registerGrade = require('../grades/registerGrade');
const { assignations } = require('../tables');
const getAssignation = require('./getAssignation');

const { getDiff } = global.utils;

// const updatableFields = [
//   'indexable',
//   'classes',
//   'group',
//   'grades',
//   'timestamps',
//   'status',
//   'metadata',
// ];

module.exports = async function updateAssignation(assignation, { userSession, transacting } = {}) {
  const { assignableInstance, user, ...assignationObj } = assignation;

  validateAssignation(assignationObj);

  // TODO: Check permissions

  const currentAssignation = await getAssignation.call(this, assignableInstance, user, {
    userSession,
    transacting,
  });

  const { id } = currentAssignation;

  // EN: Check if the user agent is not the user (if it is not, it is a teacher)
  // ES: Comprueba si el usuario no es el usuario (si no es, es un profesor)
  /*
   const userUpdatableFields = updatableFields;


   if (userSession.userAgents.map((u) => u.id).includes(currentAssignation.user)) {
     userUpdatableFields = ['timestamps', 'status'];
   }

   // EN: Check if any non-updatable field is being updated
   // ES: Comprueba si se está actualizando algún campo no actualizable
   if (_.keys(_.omit(assignationObj, userUpdatableFields)).length) {
     throw new Error('Some of the provided keys are not updatable by the current user');
   }
  */

  // EN: Get the fields that are being updated
  // ES: Obtener los campos que se están actualizando
  const { object, diff } = getDiff(assignationObj, currentAssignation);

  if (!diff.length) {
    throw new Error('No changes detected');
  }

  // EN: Update dates
  // ES: Actualizar fechas
  if (diff.includes('timestamps')) {
    await updateDates('assignation', id, object.timestamps, { transacting });
  }

  // EN: Update the grades
  // ES: Actualizar las notas
  if (diff.includes('grades')) {
    await Promise.all(
      assignationObj.grades.map((grade) =>
        registerGrade(
          {
            assignation: id,
            subject: grade.subject,
            grade: grade.grade,
            feedback: grade.feedback,
            gradedBy: grade.gradedBy,
            visibleToStudent: grade.visibleToStudent,
            type: grade.type,
          },
          { userSession, transacting }
        )
      )
    );
  }

  // EN: Update the assignation
  // ES: Actualizar la asignación
  if (_.pull(diff, 'timestamps', 'grades').length) {
    await assignations.update(
      {
        id,
      },
      {
        ..._.omit(object, ['timestamps', 'grades']),
        classes: JSON.stringify(object.classes),
        metadata: JSON.stringify(object.metadata),
      },
      { transacting }
    );
  }

  return assignationObj;
};
