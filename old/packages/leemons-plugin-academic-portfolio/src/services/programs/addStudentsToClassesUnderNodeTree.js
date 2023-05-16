const { table } = require('../tables');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');
const { addStudentsClassesUnderNodeTree } = require('../common/addStudentsToClassesUnderNodeTree');

async function addStudentsToClassesUnderNodeTree(
  program,
  nodeType,
  nodeId,
  students,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const nodeTypes = await getProgramTreeTypes(program, { transacting });
      return addStudentsClassesUnderNodeTree(nodeTypes, nodeType, nodeId, students, {
        transacting,
      });
    },
    table.programs,
    _transacting
  );
}

module.exports = { addStudentsToClassesUnderNodeTree };
