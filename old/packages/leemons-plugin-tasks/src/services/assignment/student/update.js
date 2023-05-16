const _ = require('lodash');
const assignablesServices = require('../../assignables');

const { getDiff } = global.utils;

const STUDENT_UPDATABLE_FIELDS = [
  'timestamps.open',
  'timestamps.start',
  'timestamps.end',
  'metadata.submission',
  'metadata.visitedSteps',
];

const TEACHER_UPDATABLE_FIELD = ['grades'];

module.exports = async function update(
  { student, instance, ...data },
  { userSession, transacting } = {}
) {
  const { assignations } = assignablesServices();

  // EN: Check if it is the student or the teacher
  // ES: Comprobar si es el estudiante o el profesor
  const isStudent = _.map(userSession.userAgents, 'id').includes(student);

  // EN: Only update the allowed fields
  // ES: Solo actualizar los campos permitidos
  const newData = _.pick(data, isStudent ? STUDENT_UPDATABLE_FIELDS : TEACHER_UPDATABLE_FIELD);

  if (newData.timestamps) {
    const assignation = await assignations.getAssignation(instance, student, {
      userSession,
      transacting,
    });

    // EN: The student is unable to replace the existing timestamps
    // ES: El estudiante no puede reemplazar los timestamps existentes
    newData.timestamps = _.defaults(assignation.timestamps, newData.timestamps);
  }

  if (newData.grades) {
    newData.grades = newData.grades.map((grade) => ({
      ...grade,
      gradedBy: userSession.userAgents[0].id,
    }));
  }

  // EN: Update the instance
  // ES: Actualizar la instancia
  const updatedAssignation = await assignations.updateAssignation(
    {
      assignableInstance: instance,
      user: student,
      ...newData,
    },
    { userSession, transacting }
  );

  return updatedAssignation;
};
