const _ = require('lodash');
const { table } = require('../tables');

async function duplicateSubjectCreditsBySubjectsIds(
  subjectIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const programSubjectCredits = await table.programSubjectsCredits.find(
        { subject_$in: subjectIds },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-program-subject-credits', {
        programSubjectCredits,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newSubjectCredits = await Promise.all(
        _.map(programSubjectCredits, ({ id, ...item }) =>
          table.programSubjectsCredits.create(
            {
              ...item,
              program:
                duplications.programs && duplications.programs[item.program]
                  ? duplications.programs[item.program].id
                  : item.program,
              subject:
                duplications.subjects && duplications.subjects[item.subject]
                  ? duplications.subjects[item.subject].id
                  : item.subject,
              course:
                duplications.courses && duplications.courses[item.course]
                  ? duplications.courses[item.course].id
                  : item.course,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.subjectCredits)) duplications.subjectCredits = {};
      _.forEach(programSubjectCredits, ({ id }, index) => {
        duplications.subjectCredits[id] = newSubjectCredits[index];
      });
      await leemons.events.emit('after-duplicate-program-subject-credits', {
        programSubjectCredits,
        duplications: duplications.subjectCredits,
        transacting,
      });
      return duplications;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { duplicateSubjectCreditsBySubjectsIds };
