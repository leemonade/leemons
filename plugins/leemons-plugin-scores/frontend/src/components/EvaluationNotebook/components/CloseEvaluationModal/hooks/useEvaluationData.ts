import { getRetakeGrades } from '../helpers/getRetakeGrades';
import { getStudentGrades } from '../helpers/getStudentGrades';
import { TableData, StudentScores } from '../types';

export function useEvaluationData(tableData: TableData) {
  const studentGrades = getStudentGrades({
    activities: tableData.activitiesData.activities,
    students: tableData.activitiesData.value,
    grades: tableData.grades,
  });

  const students = tableData.activitiesData.value.map<StudentScores>((student) => {
    const { maxGradedRetake, retakeGrades } = getRetakeGrades({
      student,
      default: studentGrades[student.id],
    });

    if (!retakeGrades['0']) {
      retakeGrades['0'] = {
        id: null,
        order: 0,
        grade: studentGrades[student.id],
      };
    }

    return {
      student: {
        id: student.id,
        name: `${student.surname} ${student.name}`,
        avatar: student.image || null,
      },
      retakes: retakeGrades,
      final: !maxGradedRetake ? '0' : maxGradedRetake?.id ?? `${maxGradedRetake?.order}`,
    };
  });

  const retakes = tableData.retakes.map((retake) => ({
    id: retake.id,
    index: retake.index,
  }));

  return {
    students,
    retakes,
  };
}
