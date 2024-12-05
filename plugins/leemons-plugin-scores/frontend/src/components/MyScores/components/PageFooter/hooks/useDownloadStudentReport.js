import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import { useUserAgentsInfo } from '@users/hooks';
import useUserAgents from '@users/hooks/useUserAgents';
import { isNil, keyBy } from 'lodash';

import useDownloadScoreReport from '@scores/components/EvaluationNotebook/components/PageFooter/hooks/useDownloadScoreReport';
import useMyScoresStore from '@scores/stores/myScoresStore';

export default function useDownloadStudentReport() {
  const columns = useMyScoresStore((store) => store.columns);
  const finalScores = useMyScoresStore((store) => store.finalScores);
  const filters = useMyScoresStore((store) => store.filters);
  const classes = useMyScoresStore((store) => keyBy(store.classes, 'id'));

  const downloadScoreReport = useDownloadScoreReport();

  const userAgents = useUserAgents();
  const { data: userAgentsInfo } = useUserAgentsInfo(userAgents?.[0], {
    enabled: !!userAgents?.[0],
  });

  const { data: programEvaluationSystems } = useProgramEvaluationSystems({
    program: filters.program,
  });

  return () => {
    if (!columns?.size) {
      return;
    }

    const data = [];

    columns.entries().forEach(([klass, activities]) => {
      const finalScoreData = finalScores.get(klass);

      const tableData = {
        activitiesData: {
          activities: activities.map((activity) => {
            const { instance } = activity;
            return {
              id: instance.id,
              deadline: instance.dates.deadline ?? null,
              instance,
              name: instance.assignable.asset.name,
              role: instance.assignable.asset.role,
              type: instance.gradable ? 'evaluable' : 'non-evaluable',
              weight: activity.weight,
            };
          }),
          value: [
            {
              activities: activities.map((activity) => ({
                id: activity.instance.id,
                isSubmitted: !isNil(activity.mainGrade) || !!activity.timestamps?.end,
                score: activity.mainGrade,
              })),
              customScore: finalScoreData.grade,
              name: userAgentsInfo?.[0]?.user?.name,
              surname: userAgentsInfo?.[0]?.user?.surnames,
            },
          ],
          class: classes[klass],
        },

        subjectData: classes[klass].subject,
        grades: programEvaluationSystems.scales,
        programData: filters.program,
        filters,
      };

      data.push(tableData);
    });

    downloadScoreReport(data);
  };
}
