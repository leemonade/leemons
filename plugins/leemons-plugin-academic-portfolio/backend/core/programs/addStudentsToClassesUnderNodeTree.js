const { getProgramTreeTypes } = require('./getProgramTreeTypes');
const { addStudentsClassesUnderNodeTree } = require('../common/addStudentsToClassesUnderNodeTree');

async function addStudentsToClassesUnderNodeTree({ program, nodeType, nodeId, students, ctx }) {
  const nodeTypes = await getProgramTreeTypes({ program, ctx });
  return addStudentsClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, students, ctx });
}

module.exports = { addStudentsToClassesUnderNodeTree };
