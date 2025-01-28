import { useCallback } from 'react';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { StudentEvaluationData, TableData } from '../../CloseEvaluationModal/types';

import { prefixPN } from '@scores/helpers';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import { useSetRetakeScoreMutation } from '@scores/requests/hooks/mutations/useSetRetakeScore';

export function useCloseEvaluation(tableData: TableData) {
  const { mutateAsync: setRetakeScore } = useSetRetakeScoreMutation();
  const { mutateAsync: setFinalScores } = useScoresMutation();

  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));

  const students = tableData?.activitiesData?.value;
  const klass = tableData?.class;
  const period = tableData?.filters?.period?.period;

  return useCallback(
    (data: Record<string, StudentEvaluationData>) => {
      const promises = [];

      const finalScores = students.map((student) => {
        const hasFirstRetakeScore = student.retakeScores?.[0]?.grade;

        if (!hasFirstRetakeScore) {
          promises.push(
            setRetakeScore({
              classId: klass.id,
              period: period?.id,
              retakeId: null,
              retakeIndex: 0,
              user: student.id,
              grade: data[student.id].meanGrade,
            })
          );
        }

        return {
          student: student.id,
          class: klass.id,
          period: period?.id,
          grade: data[student.id].finalGrade,
          retake: data[student.id].final,
          published: true,
        };
      });

      promises.push(setFinalScores({ scores: finalScores, instances: [] }));

      return Promise.all(promises)
        .then(() => {
          addSuccessAlert(t('closedEvaluationSuccess', { period: period.name }));
        })
        .catch((e) => {
          addErrorAlert(t('closedEvaluationError'), e.message);
        });
    },
    [students, klass, period, t, setRetakeScore, setFinalScores]
  );
}
