const { getTree } = require('./getTree');
const { getTreeNodes } = require('./getTreeNodes');
const { listClassesSubjects } = require('./listClassesSubjects');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addStudentsClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { addTeachersClassesUnderNodeTree } = require('./addTeachersToClassesUnderNodeTree');

module.exports = {
  getTree,
  getTreeNodes,
  listClassesSubjects,
  getClassesUnderNodeTree,
  addStudentsClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
};
