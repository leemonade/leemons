import { createPortal } from 'react-dom';

import ModalContent from './components/ModalContent';
import { getRetakeGrades } from './helpers/getRetakeGrades';
import { getStudentGrades } from './helpers/getStudentGrades';
import { StudentScores, TableData } from './types';

interface Props {
  opened: boolean;
  tableData: TableData;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CloseEvaluationModal({ opened, tableData, onCancel, onConfirm }: Props) {
  if (!opened) {
    return null;
  }

  const studentGrades = getStudentGrades({
    activities: tableData.activitiesData.activities,
    students: tableData.activitiesData.value,
    grades: tableData.grades,
  });

  const students = tableData.activitiesData.value.map<StudentScores>((student) => {
    const { maxGradedRetake, retakeGrades } = getRetakeGrades(student);

    if (!retakeGrades['0']) {
      retakeGrades['0'] = {
        id: null,
        order: 0,
        grade: studentGrades[student.id],
      };
    }

    return {
      student: {
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

  return createPortal(
    <ModalContent
      students={students}
      retakes={retakes}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />,
    document.body
  );
}
