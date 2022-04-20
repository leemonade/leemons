const _ = require('lodash');
const getSubjects = require('./getSubjects');
const removeSubjects = require('./removeSubjects');
const saveSubjects = require('./saveSubjects');

module.exports = async function updateSubjects(assignable, subjects, { transacting } = {}) {
  // EN: Get the existing subjects.
  // ES: Obtiene los temas existentes.
  const existingSubjects = await getSubjects(assignable, { ids: true, transacting });

  // EN: Create the new subjects.
  // ES: Crea los nuevos temas.
  const subjectsToAdd = _.differenceWith(subjects, existingSubjects, (a, b) =>
    _.isEqual(a, _.omit(b, ['id']))
  );
  await saveSubjects(assignable, subjectsToAdd, { transacting });

  // EN: Remove the old subjects.
  // ES: Elimina los temas antiguos.
  const subjectsToRemove = _.differenceWith(existingSubjects, subjects, (a, b) =>
    _.isEqual(_.omit(a, ['id']), b)
  );

  await removeSubjects(
    subjectsToRemove.map((s) => s.id),
    { transacting }
  );

  return getSubjects(assignable, { transacting });
};
