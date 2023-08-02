const { addClass } = require('./addClass');
const { listClasses } = require('./listClasses');
const { updateClass } = require('./updateClass');
const { haveClasses } = require('./haveClasses');
const { classByIds } = require('./classByIds');
const { updateClassMany } = require('./updateClassMany');
const { addClassStudents } = require('./addClassStudents');
const { addClassTeachers } = require('./addClassTeachers');
const { addInstanceClass } = require('./addInstanceClass');
const { getTeachersByClass } = require('./getTeachersByClass');
const { listStudentClasses } = require('./listStudentClasses');
const { listTeacherClasses } = require('./listTeacherClasses');
const { removeClassesByIds } = require('./removeClassesByIds');
const { listSessionClasses } = require('./listSessionClasses');
const { listSubjectClasses } = require('./listSubjectClasses');
const { addClassStudentsMany } = require('./addClassStudentsMany');
const { addClassTeachersMany } = require('./addClassTeachersMany');
const { getClassesUnderProgram } = require('./getClassesUnderProgram');
const { classDetailForDashboard } = require('./classDetailForDashboard');
const { getBasicClassesByProgram } = require('./getBasicClassesByProgram');
const { getClassesUnderProgramCourse } = require('./getClassesUnderProgramCourse');

module.exports = {
  addClass,
  classByIds,
  listClasses,
  updateClass,
  haveClasses,
  updateClassMany,
  addClassTeachers,
  addClassStudents,
  addInstanceClass,
  getTeachersByClass,
  listSubjectClasses,
  listStudentClasses,
  listTeacherClasses,
  removeClassesByIds,
  listSessionClasses,
  addClassStudentsMany,
  addClassTeachersMany,
  getClassesUnderProgram,
  classDetailForDashboard,
  getBasicClassesByProgram,
  getClassesUnderProgramCourse,
};
