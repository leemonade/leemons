const _ = require('lodash');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addClassTeachers } = require('../classes/addClassTeachers');

async function addTeachersClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, teachers, ctx }) {
  const classes = await getClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, ctx });
  return Promise.all(
    _.map(classes, (_class) => addClassTeachers({ data: { class: _class.id, teachers }, ctx }))
  );
}

module.exports = { addTeachersClassesUnderNodeTree };
