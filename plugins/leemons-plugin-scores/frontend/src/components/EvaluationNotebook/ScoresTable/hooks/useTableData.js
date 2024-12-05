import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';

import useActivitiesWithWeights from './useActivitiesWithWeights';
import useStudents from './useStudents';

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

  return {
    scales: programEvaluationSystem?.scales,
    usePercentage: programEvaluationSystem?.isPercentage,
    activities,
    studentsData,
    isLoading: activitiesLoading || programEvaluationSystemLoading || studentsLoading,
  };
}
