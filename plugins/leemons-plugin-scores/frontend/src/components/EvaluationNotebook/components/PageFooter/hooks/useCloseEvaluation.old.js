import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { findNearestFloorScore } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/ScoreFeedback';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { sortBy } from 'lodash';

import { prefixPN } from '@scores/helpers';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import { useSetRetakeScoreMutation } from '@scores/requests/hooks/mutations/useSetRetakeScore';

export default function useCloseEvaluation() {
  const { mutateAsync } = useScoresMutation();
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));

  const { mutate: setRetakeScore } = useSetRetakeScoreMutation();

  return ({
    activitiesData: { activities, value: students },
    grades,
    class: klass,
    filters: {
      period: { period },
    },
    retakes,
  }) => {
    const weightPerActivity = activities.reduce((acc, activity) => {
      acc[activity.id] = activity.weight;
      return acc;
    }, {});

    const minScore = sortBy(grades, 'number')[0].number;
    const maxScore = sortBy(grades, 'number').reverse()[0].number;

    const scores = students.map((student) => {
      const retakeHigherScore =
        student?.retakeScores?.reduce((acc, retake) => {
          return Math.max(acc, retake.grade);
        }, Number.MIN_VALUE) ?? null;

      const grade =
        student.customScore ??
        retakeHigherScore ??
        student.activities.reduce((acc, activity) => {
          const weight = weightPerActivity[activity.id];
          const score = Math.max(Math.min(maxScore, activity.score ?? minScore), minScore);

          return acc + score * (weight ?? 0);
        }, 0);

      const scale = findNearestFloorScore(grade, grades);

      if (!student.customScore && !student?.retakeScores?.[0]?.grade) {
        setRetakeScore({
          classId: klass.id,
          period: period?.id,
          retakeId: null,
          retakeIndex: 0,
          user: student.id,
          grade: scale.number,
        });
      }

      return {
        student: student.id,
        class: klass.id,
        period: period?.id,

        grade: scale.number,
        published: true,
      };
    });

    return mutateAsync({ scores })
      .then(() => addSuccessAlert(t('closedEvaluationSuccess', { period: period.name })))
      .catch((e) => {
        addErrorAlert(t('closedEvaluationError'), e.message);
      });
  };
}
