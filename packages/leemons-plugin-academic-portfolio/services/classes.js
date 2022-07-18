const {
  getByClassAndUserAgent: studentGetByClassAndUserAgent,
} = require('../src/services/classes/student/getByClassAndUserAgent');
const { classByIds } = require('../src/services/classes/classByIds');
const { getByClass } = require('../src/services/classes/student/getByClass');
const {
  getBasicClassesByProgram,
  addClass,
  listClasses,
  updateClassMany,
} = require('../src/services/classes');
const { addClassStudentsMany } = require('../src/services/classes/addClassStudentsMany');
const { listSessionClasses } = require('../src/services/classes/listSessionClasses');
const { add: addTeacher } = require('../src/services/classes/teacher/add');
const {
  removeByClass: removeTeachersByClass,
} = require('../src/services/classes/teacher/removeByClass');

module.exports = {
  listSessionClasses,
  getBasicClassesByProgram,
  student: {
    getByClassAndUserAgent: studentGetByClassAndUserAgent,
    getByClass,
  },
  classByIds,
  addClass,
  addTeacher,
  removeTeachersByClass,
  addStudentsToClasses: addClassStudentsMany,
  listClasses,
};
