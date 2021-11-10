const { addSubject } = require('./addSubject');
const { listSubjects } = require('./listSubjects');
const { updateSubject } = require('./updateSubject');
const { subjectNeedCourseForAdd } = require('./subjectNeedCourseForAdd');

module.exports = {
  addSubject,
  listSubjects,
  updateSubject,
  subjectNeedCourseForAdd,
};
