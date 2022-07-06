const {
  getByClassAndUserAgent: studentGetByClassAndUserAgent,
} = require('../src/services/classes/student/getByClassAndUserAgent');
const { classByIds } = require('../src/services/classes/classByIds');
const { getByClass } = require('../src/services/classes/student/getByClass');
const { getBasicClassesByProgram, addClass, listClasses } = require('../src/services/classes');
const { addClassStudentsMany } = require('../src/services/classes/addClassStudentsMany');
const { listSessionClasses } = require('../src/services/classes/listSessionClasses');

module.exports = {
  listSessionClasses,
  getBasicClassesByProgram,
  student: {
    getByClassAndUserAgent: studentGetByClassAndUserAgent,
    getByClass,
  },
  classByIds,
  addClass,
  addStudentsToClasses: addClassStudentsMany,
  listClasses,
};
