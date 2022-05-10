const { onAcademicPortfolioAddClass } = require('./onAcademicPortfolioAddClass');
const { onAcademicPortfolioUpdateClass } = require('./onAcademicPortfolioUpdateClass');
const { onAcademicPortfolioRemoveClasses } = require('./onAcademicPortfolioRemoveClasses');
const { onAcademicPortfolioAddClassStudent } = require('./onAcademicPortfolioAddClassStudent');
const {
  onAcademicPortfolioRemoveClassStudents,
} = require('./onAcademicPortfolioRemoveClassStudents');
const {
  onAcademicPortfolioRemoveStudentFromClass,
} = require('./onAcademicPortfolioRemoveStudentFromClass');
const { onAcademicPortfolioAddClassTeacher } = require('./onAcademicPortfolioAddClassTeacher');
const {
  onAcademicPortfolioRemoveClassTeachers,
} = require('./onAcademicPortfolioRemoveClassTeachers');

module.exports = {
  onAcademicPortfolioAddClass,
  onAcademicPortfolioUpdateClass,
  onAcademicPortfolioRemoveClasses,
  onAcademicPortfolioAddClassStudent,
  onAcademicPortfolioAddClassTeacher,
  onAcademicPortfolioRemoveClassStudents,
  onAcademicPortfolioRemoveClassTeachers,
  onAcademicPortfolioRemoveStudentFromClass,
};
