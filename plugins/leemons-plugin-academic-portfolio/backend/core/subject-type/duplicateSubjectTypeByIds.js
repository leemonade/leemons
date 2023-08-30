const _ = require('lodash');

async function duplicateSubjectTypeByIds({ ids, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const subjectTypes = await ctx.tx.db.SubjectTypes.find({
    id: _.isArray(ids) ? ids : [ids],
  }).lean();
  await ctx.tx.emit('before-duplicate-subject-types', { subjectTypes });
  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newSubjectTypes = await Promise.all(
    _.map(subjectTypes, ({ id, ...item }) =>
      ctx.tx.db.SubjectTypes.create({
        ...item,
        program:
          duplications.programs && duplications.programs[item.program]
            ? duplications.programs[item.program].id
            : item.program,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.subjectTypes)) duplications.subjectTypes = {};
  _.forEach(subjectTypes, ({ id }, index) => {
    duplications.subjectTypes[id] = newSubjectTypes[index];
  });
  await ctx.tx.emit('after-duplicate-subject-types', {
    subjectTypes,
    duplications: duplications.subjectTypes,
  });
  return duplications;
}

module.exports = { duplicateSubjectTypeByIds };
