import { useContext, useCallback } from 'react';

import { StudentScores, StudentEvaluationData } from '../types';

import { Context } from '@scores/stores/retakePickerStore';

export function useOnCloseEvaluation({
  students,
  onConfirm,
}: {
  students: StudentScores[];
  onConfirm: (data: Record<string, StudentEvaluationData>) => void;
}) {
  const store = useContext(Context);

  return useCallback(() => {
    const selectedRetakes = store.getState().students;
    const finalData: Record<string, StudentEvaluationData> = {};

    students.forEach((student) => {
      const selectedRetake = selectedRetakes[student.student.id]?.selectedRetake ?? student.final;

      finalData[student.student.id] = {
        meanGrade: student.retakes[0].grade,
        final: selectedRetake,
        finalGrade: student.retakes[selectedRetake]?.grade,
      };
    });

    onConfirm(finalData);
  }, [students, store, onConfirm]);
}
