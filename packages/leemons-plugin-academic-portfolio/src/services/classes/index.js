const { addClass } = require('./addClass');
const { listClasses } = require('./listClasses');
const { updateClass } = require('./updateClass');
const { updateClassMany } = require('./updateClassMany');
const { addClassStudents } = require('./addClassStudents');
const { addClassTeachers } = require('./addClassTeachers');
const { listStudentClasses } = require('./listStudentClasses');
const { listTeacherClasses } = require('./listTeacherClasses');

module.exports = {
  addClass,
  listClasses,
  updateClass,
  updateClassMany,
  addClassTeachers,
  addClassStudents,
  listStudentClasses,
  listTeacherClasses,
};
