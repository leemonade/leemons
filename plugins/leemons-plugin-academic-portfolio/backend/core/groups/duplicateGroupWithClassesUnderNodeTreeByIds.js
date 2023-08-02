const _ = require('lodash');
const { table } = require('../tables');
const { getClassesUnderNodeTree } = require('../common/getClassesUnderNodeTree');
const { duplicateClassesByIds } = require('../classes/duplicateClassesByIds');

async function duplicateGroupWithClassesUnderNodeTreeByIds(
  nodeTypes,
  ids,
  {
    students = false,
    teachers = false,
    name,
    abbreviation,
    userSession,
    transacting: _transacting,
  } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const groups = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'group' },
        { transacting }
      );
      const classes = await getClassesUnderNodeTree(nodeTypes, 'groups', _.map(groups, 'id'), {
        transacting,
      });
      await leemons.events.emit('before-duplicate-groups-with-classes', { groups, transacting });

      const duplications = {};

      // ES: Empezamos la duplicación de los items
      // EN: Start the duplication of the items
      const newGroups = await Promise.all(
        _.map(groups, ({ id, ...item }) =>
          table.groups.create(
            {
              ...item,
              name: name || item.name,
              abbreviation: abbreviation || item.abbreviation,
            },
            { transacting }
          )
        )
      );

      // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
      // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
      if (!_.isObject(duplications.groups)) duplications.groups = {};
      _.forEach(groups, ({ id }, index) => {
        duplications.groups[id] = newGroups[index];
      });

      await duplicateClassesByIds(_.map(classes, 'id'), {
        duplications,
        groups: true,
        courses: true,
        substages: true,
        knowledges: true,
        students,
        teachers,
        userSession,
        transacting,
      });

      await leemons.events.emit('after-duplicate-groups-with-classes', {
        groups,
        duplications: duplications.groups,
        transacting,
      });
      return duplications;
    },
    table.groups,
    _transacting
  );
}

module.exports = { duplicateGroupWithClassesUnderNodeTreeByIds };
