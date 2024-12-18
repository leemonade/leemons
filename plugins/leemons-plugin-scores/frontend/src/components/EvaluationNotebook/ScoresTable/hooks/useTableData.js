import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';

import useActivitiesWithWeights from './useActivitiesWithWeights';
import useStudents from './useStudents';

import { useRetakes } from '@scores/requests/hooks/queries/useRetakes';

export default function useTableData({ program, class: klass, period, filters }) {
  const { activities, isLoading: activitiesLoading } = useActivitiesWithWeights({
    program,
    class: klass,
    period,
    filters,
  });

  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    activities,
    class: klass,
    filters,
    period: period?.period?.id,
  });

  const { data: programEvaluationSystem, isLoading: programEvaluationSystemLoading } =
    useProgramEvaluationSystems({ program });

  const { data: retakes, isLoading: retakesLoading } = useRetakes({
    classId: klass?.id,
    period: period?.period?.id,
    enabled: !!klass?.id && !!period?.period?.id,
  });

  return {
    scales: programEvaluationSystem?.scales,
    usePercentage: programEvaluationSystem?.isPercentage,
    activities,
    studentsData,
    retakes,
    isLoading:
      activitiesLoading || programEvaluationSystemLoading || studentsLoading || retakesLoading,
  };
}
