import dayjs from 'dayjs';

function hasGrades(studentData) {
  const grades = studentData?.grades;

  if (!grades || !grades.length) {
    return false;
  }

  return grades.some((grade) => grade.type === 'main' && grade.visibleToStudent);
}

export default function getStatus(studentData, instanceData) {
  // EN: This values are keys for the localization object prefixPN('activity_status')
  // ES: Estos valores son claves para el objeto de traducción prefixPN('activity_status')

  if (studentData.finished) {
    const isGradable = !!instanceData?.requiresScoring;

    if (isGradable && hasGrades(studentData)) {
      return 'evaluated';
    }
    const deadline = dayjs(instanceData.dates.deadline || null);
    const endDate = dayjs(studentData?.timestamps?.end || null);

    const endDateIsLate = endDate.isValid() && endDate.isAfter(deadline);

    if (endDateIsLate) {
      return 'late';
    }

    if (endDate.isValid()) {
      return isGradable ? 'submitted' : 'ended';
    }

    return 'closed';
  }

  if (studentData.started) {
    const startDate = dayjs(studentData?.timestamps?.start || null);

    if (startDate.isValid()) {
      return 'started';
    }
    return 'opened';
  }

  return 'assigned';
}
