const _ = require('lodash');
const { table } = require('../tables');

async function duplicateProgramCentersByProgramIds(
  programIds,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const programCenter = await table.programCenter.find(
        { program_$in: _.isArray(programIds) ? programIds : [programIds] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-program-center', {
        programCenter,
        transacting,
      });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newProgramCenters = await Promise.all(
        _.map(programCenter, ({ id, ...item }) =>
          table.programCenter.create(
            {
              ...item,
              program:
                duplications.programs && duplications.programs[item.program]
                  ? duplications.programs[item.program].id
                  : item.program,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.programCenters)) duplications.programCenters = {};
      _.forEach(programCenter, ({ id }, index) => {
        duplications.programCenters[id] = newProgramCenters[index];
      });

      await leemons.events.emit('after-duplicate-program-center', {
        programCenter,
        duplications: duplications.programCenters,
        transacting,
      });
      return duplications;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { duplicateProgramCentersByProgramIds };
