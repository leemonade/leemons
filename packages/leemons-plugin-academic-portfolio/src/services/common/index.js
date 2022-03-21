const { getTree } = require('./getTree');
const { getTreeNodes } = require('./getTreeNodes');
const { getStudentsByTags } = require('./getStudentsByTags');
const { listClassesSubjects } = require('./listClassesSubjects');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addStudentsClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { addTeachersClassesUnderNodeTree } = require('./addTeachersToClassesUnderNodeTree');

module.exports = {
  getTree,
  getTreeNodes,
  getStudentsByTags,
  listClassesSubjects,
  getClassesUnderNodeTree,
  addStudentsClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
};
