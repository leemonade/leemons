function getGradeObject() {
  const grade = {
    id: 'grade1',
    assignation: 'assignationIdinstanceId1',
    subject: 'Math',
    type: 'main',
    grade: 90,
    gradedBy: 'Teacher',
    feedback: 'Good job',
    visibleToStudent: true,
  };
  return {
    grade,
    grades: [
      grade,
      {
        id: 'grade2',
        assignation: 'assignationIdinstanceId2',
        subject: 'Science',
        type: 'main',
        grade: 85,
        gradedBy: 'Teacher',
        feedback: 'Well done',
        visibleToStudent: false,
      },
    ],
  };
}

module.exports = { getGradeObject };
