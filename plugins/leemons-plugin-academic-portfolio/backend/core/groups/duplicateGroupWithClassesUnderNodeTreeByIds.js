const _ = require('lodash');
const { getClassesUnderNodeTree } = require('../common/getClassesUnderNodeTree');
const { duplicateClassesByIds } = require('../classes/duplicateClassesByIds');

async function duplicateGroupWithClassesUnderNodeTreeByIds({
  nodeTypes,
  ids,
  students = false,
  teachers = false,
  name,
  abbreviation,
  ctx,
}) {
  const groups = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'group',
  }).lean();
  const classes = await getClassesUnderNodeTree({
    nodeTypes,
    nodeType: 'groups',
    nodeId: _.map(groups, 'id'),
    ctx,
  });
  await ctx.tx.emit('before-duplicate-groups-with-classes', { groups });

  const duplications = {};

  // ES: Empezamos la duplicación de los items
  // EN: Start the duplication of the items
  const newGroups = await Promise.all(
    _.map(groups, ({ id, ...item }) =>
      ctx.tx.db.Groups.create({
        ...item,
        name: name || item.name,
        abbreviation: abbreviation || item.abbreviation,
      }).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );

  // ES: Añadimos los items duplicados de tal forma que el indice es el id original y el valor es el nuevo item duplicado
  // EN: Add the duplicated items in such a way that the index is the original id and the value is the new duplicated item
  if (!_.isObject(duplications.groups)) duplications.groups = {};
  _.forEach(groups, ({ id }, index) => {
    duplications.groups[id] = newGroups[index];
  });

  await duplicateClassesByIds({
    ids: _.map(classes, 'id'),
    duplications,
    students,
    teachers,
    groups: true,
    courses: true,
    substages: true,
    knowledges: true,
    ctx,
  });

  await ctx.tx.emit('after-duplicate-groups-with-classes', {
    groups,
    duplications: duplications.groups,
  });
  return duplications;
}

module.exports = { duplicateGroupWithClassesUnderNodeTreeByIds };
