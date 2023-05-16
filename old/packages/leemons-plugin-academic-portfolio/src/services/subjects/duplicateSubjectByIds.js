const _ = require('lodash');
const { table } = require('../tables');
const { duplicateSubjectCreditsBySubjectsIds } = require('./duplicateSubjectCreditsBySubjectsIds');

async function duplicateSubjectByIds(
  ids,
  { duplications: dup = {}, transacting: _transacting } = {}
) {
  const duplications = dup;
  return global.utils.withTransaction(
    async (transacting) => {
      const subjects = await table.subjects.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-duplicate-subjects', { subjects, transacting });

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newSubjects = await Promise.all(
        _.map(subjects, ({ id, ...item }) =>
          table.subjects.create(
            {
              ...item,
              program:
                duplications.programs && duplications.programs[item.program]
                  ? duplications.programs[item.program].id
                  : item.program,
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
      if (!_.isObject(duplications.subjects)) duplications.subjects = {};
      _.forEach(subjects, ({ id }, index) => {
        duplications.subjects[id] = newSubjects[index];
      });

      // ES: Duplicamos a los hijos
      // EN: Duplicate the children
      await duplicateSubjectCreditsBySubjectsIds(_.map(subjects, 'id'), {
        duplications,
        transacting,
      });
      await leemons.events.emit('after-duplicate-subjects', {
        subjects,
        duplications: duplications.subjects,
        transacting,
      });
      return duplications;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { duplicateSubjectByIds };
