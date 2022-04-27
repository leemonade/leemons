const _ = require('lodash');
const getDiff = require('../../helpers/getDiff');
const { validateAssignation } = require('../../helpers/validators/assignation');
const updateDates = require('../dates/updateDates');
const registerGrade = require('../grades/registerGrade');
const { assignations } = require('../tables');
const getAssignation = require('./getAssignation');

const updatableFields = [
  'indexable',
  'classes',
  'group',
  'grades',
  'timestamps',
  'status',
  'metadata',
];

module.exports = async function updateAssignation(assignation, { userSession, transacting } = {}) {
  const { id, ...assignationObj } = assignation;

  // EN: Check if any non-updatable field is being updated
  // ES: Comprueba si se está actualizando algún campo no actualizable
  if (_.keys(_.omit(assignationObj, updatableFields)).length) {
    throw new Error('Some of the provided keys are not updatable');
  }

  validateAssignation(assignationObj);

  // TODO: Check permissions

  const currentAssignation = await getAssignation.call(this, id, { userSession, transacting });

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
      object.grades.map((grade) =>
        registerGrade(
          {
            assignation,
            subject: grade.subject,
            grade: grade.grade,
            feedback: grade.feedback,
            gradedBy: grade.gradedBy,
            type: grade.type,
          },
          { userSession, transacting }
        )
      )
    );
  }

  // EN: Update the assignation
  // ES: Actualizar la asignación
  if (_.omit(diff, ['timestamps', 'grades']).length) {
    await assignations.update(
      {
        id,
      },
      _.omit(object, ['timestamps', 'grades']),
      { transacting }
    );
  }

  return assignationObj;
};
