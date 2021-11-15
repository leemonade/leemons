const { getTree } = require('./getTree');
const { listClassesSubjects } = require('./listClassesSubjects');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addStudentsClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');
const { addTeachersClassesUnderNodeTree } = require('./addTeachersToClassesUnderNodeTree');

module.exports = {
  getTree,
  listClassesSubjects,
  getClassesUnderNodeTree,
  addStudentsClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
};
