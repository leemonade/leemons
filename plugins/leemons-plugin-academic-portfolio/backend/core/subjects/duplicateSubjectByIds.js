const _ = require('lodash');
const { duplicateSubjectCreditsBySubjectsIds } = require('./duplicateSubjectCreditsBySubjectsIds');

async function duplicateSubjectByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const subjects = await ctx.tx.db.Subjects.find({ id_$in: _.isArray(ids) ? ids : [ids] }).lean();
  await ctx.tx.emit('before-duplicate-subjects', { subjects });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newSubjects = await Promise.all(
    _.map(subjects, ({ id, ...item }) =>
      ctx.tx.db.Subjects.create({
        ...item,
        program:
          duplications.programs && duplications.programs[item.program]
            ? duplications.programs[item.program].id
            : item.program,
        course:
          duplications.courses && duplications.courses[item.course]
            ? duplications.courses[item.course].id
            : item.course,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.subjects)) duplications.subjects = {};
  _.forEach(subjects, ({ id }, index) => {
    duplications.subjects[id] = newSubjects[index];
  });

  // ES: Duplicamos a los hijos
  // EN: Duplicate the children
  await duplicateSubjectCreditsBySubjectsIds({
    subjectIds: _.map(subjects, 'id'),
    duplications,
    ctx,
  });
  await ctx.tx.emit('after-duplicate-subjects', {
    subjects,
    duplications: duplications.subjects,
  });
  return duplications;
}

module.exports = { duplicateSubjectByIds };
