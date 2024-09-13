const { addSubject } = require('./addSubject');
const { deleteSubjectWithClasses } = require('./deleteSubjectWithClasses');
const { getSubjectCredits, getSubjectsCredits } = require('./getSubjectCredits');
const { getTeachersBySubjects } = require('./getTeachersBySubjects');
const { getUserSubjectIds } = require('./getUserSubjectIds');
const { listSubjectCreditsForProgram } = require('./listSubjectCreditsForProgram');
const { listSubjects } = require('./listSubjects');
const { setSubjectCredits } = require('./setSubjectCredits');
const { subjectByIds } = require('./subjectByIds');
const { subjectNeedCourseForAdd } = require('./subjectNeedCourseForAdd');
const teacherFunctions = require('./teacher');
const { updateSubject } = require('./updateSubject');

module.exports = {
  addSubject,
  listSubjects,
  updateSubject,
  setSubjectCredits,
  getSubjectCredits,
  getSubjectsCredits,
  subjectNeedCourseForAdd,
  listSubjectCreditsForProgram,
  subjectByIds,
  getTeachersBySubjects,
  deleteSubjectWithClasses,
  ...teacherFunctions,
  getUserSubjectIds,
};
