const _ = require('lodash');
const { table } = require('../tables');

async function duplicateKnowledgeByIds(
  ids,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const knowledges = await table.knowledges.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-knowledges', { knowledges, transacting });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newKnowledges = await Promise.all(
        _.map(knowledges, ({ id, ...item }) =>
          table.knowledges.create(
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
      if (!_.isObject(duplications.knowledges)) duplications.knowledges = {};
      _.forEach(knowledges, ({ id }, index) => {
        duplications.knowledges[id] = newKnowledges[index];
      });
      await leemons.events.emit('after-duplicate-knowledges', {
        knowledges,
        duplications: duplications.knowledges,
        transacting,
      });
      return duplications;
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { duplicateKnowledgeByIds };
