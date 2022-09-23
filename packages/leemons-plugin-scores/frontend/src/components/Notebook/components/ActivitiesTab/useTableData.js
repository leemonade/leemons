import React from 'react';
import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import { map, uniq } from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useCache } from '@common';
import { useParsedActivities } from './useParsedActivities';
import useFinalData from './useFinalData';

function useSelectedClasses(filters) {
  const { data: sessionClasses } = useSessionClasses(
    { program: filters.program },
    { enabled: !!filters.program }
  );

  const selectedClasses = React.useMemo(() => {
    if (!sessionClasses) {
      return [];
    }

    const classesMatchingFilters = sessionClasses
      .filter(
        (klass) =>
          (klass.subject.subject === filters.subject || klass.subject.id === filters.subject) &&
          (!filters.group || klass.groups.id === filters.group)
      )
      .map((klass) => klass.id);

    return classesMatchingFilters;
  }, [sessionClasses, filters]);
  return selectedClasses;
}

function useActivities(activities) {
  const previousResult = React.useRef([]);

  const assignableInstancesQueries = useAssignableInstances({ id: activities || [] });

  const assignableInstances = React.useMemo(
    () => map(assignableInstancesQueries, 'data').filter(Boolean),
    [assignableInstancesQueries]
  );

  const isLoading = React.useMemo(
    () => assignableInstancesQueries.some((q) => q.isLoading),
    [assignableInstancesQueries]
  );

  const isRefetching = React.useMemo(
    () => assignableInstancesQueries.some((q) => q.isRefetching),
    [assignableInstancesQueries]
  );

  if (isRefetching || isLoading) {
    return {
      assignableInstances: previousResult.current,
      isLoading,
    };
  }

  previousResult.current = assignableInstances;
  return {
    assignableInstances,
    isLoading,
  };
}

function useStudents(assignableInstances) {
  const students = React.useMemo(() => {
    const stdnts = assignableInstances.flatMap((assignableInstance) => assignableInstance.students);
    return uniq(map(stdnts, 'user'));
  }, [assignableInstances]);

  const { data, isLoading } = useUserAgentsInfo(students, {
    enabled: !!students.length,
  });

  return {
    students: data,
    isLoading,
  };
}

function useFilteredAssignableInstances({ assignableInstances, filters }) {
  return assignableInstances.filter((assignableInstance) => {
    if (
      filters.filterBy === 'activity' &&
      filters.search?.length &&
      !assignableInstance.assignable.asset.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (!assignableInstance.requiresScoring) {
      return false;
    }

    if (!filters.showNonCalificables && !assignableInstance.gradable) {
      return false;
    }

    return true;
  });
}

function useGrades(assignableInstances) {
  const evaluationSystem = useProgramEvaluationSystem(assignableInstances?.[0]);
  const cache = useCache();
  const grades = React.useMemo(
    () => cache(evaluationSystem?.scales.sort((a, b) => a.number - b.number)),
    [evaluationSystem?.scales]
  );
  return grades;
}

function usePeriodData({ filters, localFilters }) {
  const selectedClasses = useSelectedClasses(filters);

  const { data: activities, isLoading: isLoadingSearchAssignableInstances } =
    useSearchAssignableInstances(
      {
        finished: true,
        finished_$gt: filters.startDate,
        finished_$lt: filters.endDate,
        classes: JSON.stringify(selectedClasses),
      },
      { enabled: !!selectedClasses.length }
    );

  const { assignableInstances, isLoading: assignableInstancesAreLoading } =
    useActivities(activities);

  const filteredAssignableInstances = useFilteredAssignableInstances({
    assignableInstances,
    filters: localFilters,
  });

  const { students: studentsData, isLoading: isLoadingStudentsData } =
    useStudents(assignableInstances);

  const grades = useGrades(assignableInstances);

  const isLoading =
    isLoadingSearchAssignableInstances ||
    isLoadingStudentsData ||
    assignableInstancesAreLoading ||
    !selectedClasses?.length;

  const activitiesData = useParsedActivities(
    isLoading,
    studentsData,
    activities,
    filteredAssignableInstances,
    filters,
    localFilters,
    assignableInstances
  );

  const cache = useCache();

  return {
    isLoading,
    activitiesData: cache(activitiesData),
    grades,
  };
}

export function useTableData({ filters, localFilters }) {
  if (filters.period?.period?.id === 'final') {
    return useFinalData({ filters, localFilters });
  }

  return usePeriodData({ filters, localFilters });
}

export default useTableData;
