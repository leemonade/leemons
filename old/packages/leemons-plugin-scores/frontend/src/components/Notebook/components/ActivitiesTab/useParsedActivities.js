import React from 'react';
import _ from 'lodash';
import { stringMatch, useCache } from '@common';
import { useScores } from '@scores/requests/hooks/queries';

function parseStudentsData({ studentsData, values: _values, scores, isSubmitted }) {
  const values = _.cloneDeep(_values);

  studentsData.forEach((student) => {
    const customScore = scores.find((s) => s.student === student.id)?.grade;

    values[student.id] = {
      activities: values[student.id]?.activities || [],
      id: student.id,
      name: student.user.name || '',
      surname: student.user.surnames || '',
      image: student.user.avatar,
      allowCustomChange: !isSubmitted,
      customScore: customScore !== undefined ? customScore : null,
    };
  });

  return values;
}

function parseStudentsGrades({ assignableInstances, filters }) {
  return assignableInstances.reduce((studentsValues, activity) => {
    activity.students.forEach((student) => {
      const grade = student.grades.find((g) => g.type === 'main' && g.subject === filters.subject);

      // eslint-disable-next-line no-param-reassign
      studentsValues[student.user] = {
        activities: [
          ...(studentsValues[student.user]?.activities || []),
          {
            id: activity.id,
            score: grade ? grade.grade : undefined,
            grade: grade || undefined,
            isSubmitted: student.timestamps?.end,
          },
        ],
      };
    });

    return studentsValues;
  }, {});
}

export function sortByStudentName(values) {
  if (!values) {
    return values;
  }

  return Object.values(values).sort((a, b) => {
    const surnameCompare = a.surname.localeCompare(b.surname);
    if (surnameCompare !== 0) {
      return surnameCompare;
    }

    const nameCompare = a.name.localeCompare(b.name);
    return nameCompare;
  });
}

export function filterStudentsByLocalFilters({ filters, values }) {
  if (filters.filterBy === 'student' && filters.search?.length) {
    return values.filter((student) =>
      stringMatch(`${student.name} ${student.surname}`, filters.search, { partial: true })
    );
  }
  return values;
}

export function useParsedActivities(
  isLoading,
  studentsData,
  activities,
  filteredAssignableInstances,
  filters,
  localFilters,
  assignableInstances
) {
  const cache = useCache();

  const { data: scores, isLoading: isLoadingScores } = useScores({
    classes: [filters?.class?.id],
    periods: [filters?.period?.period?.id],
  });
  const isPeriodSubmitted = scores?.length && !scores.some((s) => !s.published);

  return React.useMemo(() => {
    if (isLoading || isLoadingScores || !studentsData?.length || !activities?.length) {
      return {};
    }

    let values = {};

    values = parseStudentsGrades({
      values,
      assignableInstances: filteredAssignableInstances,
      filters,
    });

    values = parseStudentsData({ studentsData, values, scores, isSubmitted: isPeriodSubmitted });

    values = sortByStudentName(values);

    values = filterStudentsByLocalFilters({ filters: localFilters, values });

    const calificableInstancesCount = assignableInstances.reduce((count, activity) => {
      if (activity.gradable) {
        return count + 1;
      }
      return count;
    }, 0);

    const tableData = {
      activities: filteredAssignableInstances.map((activity) => ({
        id: activity.id,
        name: activity.assignable.asset.name,
        deadline: activity.dates.deadline || activity.dates.closed,
        weight: activity.gradable ? 1 / calificableInstancesCount : 0,
        allowChange: !isPeriodSubmitted && activity.metadata.evaluationType !== 'auto',
        type: activity.gradable ? 'calificable' : 'evaluable',
        activity,
      })),
      value: values,
      isPeriodSubmitted,
    };

    return cache('tableData', tableData);
  }, [assignableInstances, studentsData, localFilters, filters, scores]);
}

export default useParsedActivities;
