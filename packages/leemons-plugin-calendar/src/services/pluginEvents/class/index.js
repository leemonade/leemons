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

module.exports = {
  onAcademicPortfolioAddClass,
  onAcademicPortfolioUpdateClass,
  onAcademicPortfolioRemoveClasses,
  onAcademicPortfolioAddClassStudent,
  onAcademicPortfolioRemoveClassStudents,
  onAcademicPortfolioRemoveStudentFromClass,
};
