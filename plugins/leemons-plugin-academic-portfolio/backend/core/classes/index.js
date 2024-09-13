const { addClass } = require('./addClass');
const { addClassStudents } = require('./addClassStudents');
const { addClassStudentsMany } = require('./addClassStudentsMany');
const { addClassTeachers } = require('./addClassTeachers');
const { addClassTeachersMany } = require('./addClassTeachersMany');
const { addInstanceClass } = require('./addInstanceClass');
const { classByIds } = require('./classByIds');
const { classDetailForDashboard } = require('./classDetailForDashboard');
const { getBasicClassesByProgram } = require('./getBasicClassesByProgram');
const { getClassPublicData } = require('./getClassPublicData');
const { getClassesUnderProgram } = require('./getClassesUnderProgram');
const { getClassesUnderProgramCourse } = require('./getClassesUnderProgramCourse');
const { getTeachersByClass } = require('./getTeachersByClass');
const { getUserEnrollments } = require('./getUserEnrollments');
const { haveClasses } = require('./haveClasses');
const { listClasses } = require('./listClasses');
const { listSessionClasses } = require('./listSessionClasses');
const { listStudentClasses } = require('./listStudentClasses');
const { listSubjectClasses } = require('./listSubjectClasses');
const { listTeacherClasses } = require('./listTeacherClasses');
const { removeClassesByIds } = require('./removeClassesByIds');
const { changeClassSubstageBySubject } = require('./substage/changeClassSubstageBySubject');
const { updateClass } = require('./updateClass');
const { updateClassMany } = require('./updateClassMany');

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
  changeClassSubstageBySubject,
  getUserEnrollments,
  getClassPublicData,
};
