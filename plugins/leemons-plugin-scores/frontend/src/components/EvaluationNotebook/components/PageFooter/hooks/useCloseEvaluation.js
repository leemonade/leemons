import { sortBy } from 'lodash';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { findNearestFloorScore } from '@learning-paths/components/ModuleDashboard/components/DashboardCard/components/ScoreFeedback';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useScoresMutation } from '@scores/requests/hooks/mutations';

export default function useCloseEvaluation() {
  const { mutateAsync } = useScoresMutation();
  const [t] = useTranslateLoader(prefixPN('evaluationNotebook'));

  return ({
    activitiesData: { activities, value: students },
    grades,
    class: klass,
    filters: {
      period: { period },
    },
  }) => {
    const weightPerActivity = activities.reduce((acc, activity) => {
      acc[activity.id] = activity.weight;
      return acc;
    }, {});

    const minScore = sortBy(grades, 'number')[0].number;
    const maxScore = sortBy(grades, 'number').reverse()[0].number;

    const scores = students.map((student) => {
      const grade =
        student.customScore ??
        student.activities.reduce((acc, activity) => {
          const weight = weightPerActivity[activity.id];
          const score = Math.max(Math.min(maxScore, activity.score ?? minScore), minScore);

          return acc + score * (weight ?? 0);
        }, 0);

      return {
        student: student.id,
        class: klass.id,
        period: period?.id,

        grade: findNearestFloorScore(grade, grades).number,
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
