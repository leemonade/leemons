/**
 * Checks if a student has any visible grades.
 *
 * @param {object} studentData - The student data object.
 * @return {boolean} Returns true if the student has visible grades, false otherwise.
 */
function hasGrades(studentData) {
  const studentGrades = studentData?.grades;

  if (!studentGrades || !studentGrades.length) {
    return false;
  }

  return studentGrades.some((grade) => grade.visibleToStudent);
}

module.exports = { hasGrades };
