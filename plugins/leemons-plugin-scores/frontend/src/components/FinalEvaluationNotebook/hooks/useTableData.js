import { useMemo } from 'react';

import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import { map } from 'lodash';

import { useAcademicCalendarPeriods } from '../../__DEPRECATED__/ScoresPage/useAcademicCalendarPeriods';

import useStudents from './useStudents';

export default function useTableData({ class: klass, program, filters }) {
  const periods = useAcademicCalendarPeriods({
    classes: [klass],
  });

  const activities = useMemo(
    () =>
      map(periods, (period) => ({
        id: period.periods?.[program]?.[klass.courses.id],
        name: period.name,
        deadline: period.endDate,
        expandable: false,
        allowChange: false,
        type: 'evaluable',
        weight: 1 / (periods?.length || 1),
      })),
    [periods, klass, program]
  );

  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    class: klass,
    filters,
    periods,
  });

  const { data: programEvaluationSystem, isLoading: programEvaluationSystemLoading } =
    useProgramEvaluationSystems({ program });

  return {
    scales: programEvaluationSystem?.scales,
    usePercentage: programEvaluationSystem?.isPercentage,
    students: studentsData,
    activities,

    isLoading: !periods || studentsLoading || programEvaluationSystemLoading,
  };
}
