const { addClass } = require('./addClass');
const { listClasses } = require('./listClasses');
const { updateClass } = require('./updateClass');
const { haveClasses } = require('./haveClasses');
const { updateClassMany } = require('./updateClassMany');
const { addClassStudents } = require('./addClassStudents');
const { addClassTeachers } = require('./addClassTeachers');
const { addInstanceClass } = require('./addInstanceClass');
const { listStudentClasses } = require('./listStudentClasses');
const { listTeacherClasses } = require('./listTeacherClasses');
const { addClassStudentsMany } = require('./addClassStudentsMany');
const { addClassTeachersMany } = require('./addClassTeachersMany');
const { getBasicClassesByProgram } = require('./getBasicClassesByProgram');

module.exports = {
  addClass,
  listClasses,
  updateClass,
  haveClasses,
  updateClassMany,
  addClassTeachers,
  addClassStudents,
  addInstanceClass,
  listStudentClasses,
  listTeacherClasses,
  addClassStudentsMany,
  addClassTeachersMany,
  getBasicClassesByProgram,
};
