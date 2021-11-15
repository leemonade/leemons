const { getTree } = require('./getTree');
const { listClassesSubjects } = require('./listClassesSubjects');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addStudentsClassesUnderNodeTree } = require('./addStudentsToClassesUnderNodeTree');

module.exports = {
  getTree,
  listClassesSubjects,
  getClassesUnderNodeTree,
  addStudentsClassesUnderNodeTree,
};
