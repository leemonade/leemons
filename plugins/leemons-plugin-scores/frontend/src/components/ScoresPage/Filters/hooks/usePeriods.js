import { useCache } from '@common';
import { usePeriods as usePeriodsRequest } from '@scores/requests/hooks/queries';
import _ from 'lodash';
import React from 'react';
import usePeriodTypes from './usePeriodTypes';
import { useAcademicCalendarPeriods } from '../../useAcademicCalendarPeriods';

export default function usePeriods({ selectedClass, classes }) {
  const periodTypes = usePeriodTypes();

  const cache = useCache();
  const { data: periodsResponse, isLoading } = usePeriodsRequest({
    page: 0,
    size: 9999,
  });

  const adminPeriods = React.useMemo(
    () =>
      cache(
        'adminPeriods',
        periodsResponse?.items?.map((period) => ({
          ..._.omit(period, ['program', 'course']),
          programs: [period.program].filter(Boolean),
          courses: [period.course].filter(Boolean),
        })) || []
      ),
    [periodsResponse]
  );

  const academicCalendarPeriods = useAcademicCalendarPeriods({ classes });

  const periods = React.useMemo(() => {
    const allPeriods = [
      ...(adminPeriods?.map((p) => ({ ...p, group: periodTypes?.custom })) || []),
      ...(academicCalendarPeriods?.map((p) => ({ ...p, group: periodTypes?.academicCalendar })) ||
        []),
    ];

    if (!allPeriods.length) {
      return [];
    }

    return allPeriods
      ?.filter((period) => {
        if (!selectedClass) {
          return false;
        }

        if (period.courses?.length) {
          return (
            period.programs.includes(selectedClass.program) &&
            period.courses.includes(selectedClass.courses?.id)
          );
        }

        if (period.programs?.length) {
          return period.programs.includes(selectedClass.program);
        }

        return true;
      })
      ?.sort((a, b) => {
        if (a.group !== b.group) {
          if (a.group === periodTypes?.academicCalendar) {
            return -1;
          }

          return 1;
        }

        return (
          (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * 100 +
          (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * 10 +
          a.name.localeCompare(b.name)
        );
      });
  }, [adminPeriods, academicCalendarPeriods, selectedClass, periodTypes]);

  return {
    periods,
    isLoading,
  };
}
