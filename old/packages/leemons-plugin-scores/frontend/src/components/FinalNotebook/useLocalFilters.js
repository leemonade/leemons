import React from 'react';
import { stringMatch, useCache } from '@common';
import dayjs from 'dayjs';
import { filterStudentsByLocalFilters } from '../Notebook/components/ActivitiesTab/useParsedActivities';

function filterClassesByLocalFilters({ classes, filters }) {
  if (
    (filters?.filterBy !== 'subject' && filters?.filterBy !== 'group') ||
    !filters?.search?.length
  ) {
    return classes;
  }

  if (filters?.filterBy === 'subject') {
    return classes?.filter((klass) =>
      stringMatch(klass.subject.name, filters.search, { partial: true })
    );
  }
  return classes?.filter((klass) =>
    stringMatch(klass.groups.name || klass.groups.abbreviation, filters.search, { partial: true })
  );
}
function filterPeriodsByLocalFilters({ filters, periods }) {
  if (filters?.futureEvaluations && !filters?.period) {
    return periods;
  }

  return periods?.filter((period) => {
    if (!filters?.futureEvaluations && dayjs(period?.startDate).isAfter(dayjs())) {
      return false;
    }

    if (filters?.period && filters?.period !== period.id) {
      return false;
    }

    return true;
  });
}

export function useLocalFilters({ students, classes, periods, filters }) {
  const cache = useCache();
  return React.useMemo(
    () => ({
      students: cache('students', filterStudentsByLocalFilters({ filters, values: students })),
      classes: cache('classes', filterClassesByLocalFilters({ filters, classes })),
      periods: cache('periods', filterPeriodsByLocalFilters({ filters, periods })),
    }),
    [students, classes, periods, filters]
  );
}

export default useLocalFilters;
