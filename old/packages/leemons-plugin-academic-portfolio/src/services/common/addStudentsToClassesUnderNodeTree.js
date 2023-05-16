const _ = require('lodash');
const { table } = require('../tables');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addClassStudents } = require('../classes/addClassStudents');

async function addStudentsClassesUnderNodeTree(
  nodeTypes,
  nodeType,
  nodeId,
  students,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const split = nodeId.split('program|');
      const programId = split[1].split('.')[0];

      const classes = await getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, {
        program: programId,
        transacting,
      });

      const result = await Promise.all(
        _.map(classes, (_class) =>
          addClassStudents({ class: _class.id, students }, { transacting })
        )
      );
      return result;
    },
    table.class,
    _transacting
  );
}

module.exports = { addStudentsClassesUnderNodeTree };
