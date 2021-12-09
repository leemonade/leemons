const { addSubject } = require('./addSubject');
const { listSubjects } = require('./listSubjects');
const { updateSubject } = require('./updateSubject');
const { setSubjectCredits } = require('./setSubjectCredits');
const { getSubjectCredits } = require('./getSubjectCredits');
const { subjectNeedCourseForAdd } = require('./subjectNeedCourseForAdd');

module.exports = {
  addSubject,
  listSubjects,
  updateSubject,
  setSubjectCredits,
  getSubjectCredits,
  subjectNeedCourseForAdd,
};
