const _ = require('lodash');

async function duplicateSubjectCreditsBySubjectsIds({ subjectIds, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const programSubjectCredits = await ctx.tx.db.ProgramSubjectsCredits.find({
    subject: subjectIds,
  }).lean();
  await ctx.tx.emit('before-duplicate-program-subject-credits', {
    programSubjectCredits,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newSubjectCredits = await Promise.all(
    _.map(programSubjectCredits, ({ id, ...item }) =>
      ctx.tx.db.ProgramSubjectsCredits.create({
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
      })
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.subjectCredits)) duplications.subjectCredits = {};
  _.forEach(programSubjectCredits, ({ id }, index) => {
    duplications.subjectCredits[id] = newSubjectCredits[index];
  });
  await ctx.tx.emit('after-duplicate-program-subject-credits', {
    programSubjectCredits,
    duplications: duplications.subjectCredits,
  });
  return duplications;
}

module.exports = { duplicateSubjectCreditsBySubjectsIds };
