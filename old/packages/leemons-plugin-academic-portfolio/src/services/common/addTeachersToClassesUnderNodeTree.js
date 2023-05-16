const _ = require('lodash');
const { table } = require('../tables');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addClassTeachers } = require('../classes/addClassTeachers');

async function addTeachersClassesUnderNodeTree(
  nodeTypes,
  nodeType,
  nodeId,
  teachers,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = await getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { transacting });
      return Promise.all(
        _.map(classes, (_class) =>
          addClassTeachers({ class: _class.id, teachers }, { transacting })
        )
      );
    },
    table.class,
    _transacting
  );
}

module.exports = { addTeachersClassesUnderNodeTree };
