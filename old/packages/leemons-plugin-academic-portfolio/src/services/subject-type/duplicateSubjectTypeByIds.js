const _ = require('lodash');
const { table } = require('../tables');

async function duplicateSubjectTypeByIds(
  ids,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const subjectTypes = await table.subjectTypes.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-subject-types', { subjectTypes, transacting });
      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newSubjectTypes = await Promise.all(
        _.map(subjectTypes, ({ id, ...item }) =>
          table.subjectTypes.create(
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
      if (!_.isObject(duplications.subjectTypes)) duplications.subjectTypes = {};
      _.forEach(subjectTypes, ({ id }, index) => {
        duplications.subjectTypes[id] = newSubjectTypes[index];
      });
      await leemons.events.emit('after-duplicate-subject-types', {
        subjectTypes,
        duplications: duplications.subjectTypes,
        transacting,
      });
      return duplications;
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { duplicateSubjectTypeByIds };
