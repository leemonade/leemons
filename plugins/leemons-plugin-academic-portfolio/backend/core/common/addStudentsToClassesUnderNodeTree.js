const _ = require('lodash');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addClassStudents } = require('../classes/addClassStudents');

async function addStudentsClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, students, ctx }) {
  const split = nodeId.split('program|');
  const programId = split[1].split('.')[0];

  const classes = await getClassesUnderNodeTree({
    nodeTypes,
    nodeType,
    nodeId,
    program: programId,
    ctx,
  });

  const result = await Promise.all(
    _.map(classes, (_class) => addClassStudents({ data: { class: _class.id, students }, ctx }))
  );
  return result;
}

module.exports = { addStudentsClassesUnderNodeTree };
