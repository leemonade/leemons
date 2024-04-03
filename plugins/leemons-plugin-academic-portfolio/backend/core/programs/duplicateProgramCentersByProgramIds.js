const _ = require('lodash');

async function duplicateProgramCentersByProgramIds({ programIds, duplications: dup = {}, ctx }) {
  const duplications = dup;

  const programCenter = await ctx.tx.db.ProgramCenter.find({
    program: _.isArray(programIds) ? programIds : [programIds],
  }).lean();
  await ctx.tx.emit('before-duplicate-program-center', {
    programCenter,
  });

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newProgramCenters = await Promise.all(
    _.map(programCenter, ({ id, _id, __v, updatedAt, createdAt, ...item }) =>
      ctx.tx.db.ProgramCenter.create({
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
  if (!_.isObject(duplications.programCenters)) duplications.programCenters = {};
  _.forEach(programCenter, ({ id }, index) => {
    duplications.programCenters[id] = newProgramCenters[index];
  });

  await ctx.tx.emit('after-duplicate-program-center', {
    programCenter,
    duplications: duplications.programCenters,
  });
  return duplications;
}

module.exports = { duplicateProgramCentersByProgramIds };
