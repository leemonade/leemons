const { getTree } = require('./getTree');
const { getTreeNodes } = require('./getTreeNodes');
const { adminDashboard } = require('./adminDashboard');
const { getStudentsByTags } = require('./getStudentsByTags');
const { listClassesSubjects } = require('./listClassesSubjects');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addStudentsClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { addTeachersClassesUnderNodeTree } = require('./addTeachersToClassesUnderNodeTree');

module.exports = {
  getTree,
  getTreeNodes,
  adminDashboard,
  getStudentsByTags,
  listClassesSubjects,
  getClassesUnderNodeTree,
  addStudentsClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
};
