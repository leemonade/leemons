function hasGrades(studentData) {
  const studentGrades = studentData?.grades;

  if (!studentGrades || !studentGrades.length) {
    return false;
  }

  return studentGrades.some((grade) => grade.visibleToStudent);
}

module.exports = { hasGrades };
