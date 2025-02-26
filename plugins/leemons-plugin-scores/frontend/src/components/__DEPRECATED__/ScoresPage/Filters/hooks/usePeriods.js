import { useMemo } from 'react';

import { useCache } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _, { intersection } from 'lodash';

import { useAcademicCalendarPeriods } from '../../useAcademicCalendarPeriods';

import useAcademicCalendarDates from './useAcademicCalendarDates';
import usePeriodTypes from './usePeriodTypes';

import { prefixPN } from '@scores/helpers';
import { usePeriods as usePeriodsRequest } from '@scores/requests/hooks/queries';

export default function usePeriods({ selectedClass, classes }) {
  const periodTypes = usePeriodTypes();

  const cache = useCache();
  const { data: periodsResponse, isLoading } = usePeriodsRequest({
    page: 0,
    size: 9999,
  });

  const adminPeriods = useMemo(
    () =>
      cache(
        'adminPeriods',
        periodsResponse?.items?.map((period) => ({
          ..._.omit(period, ['program', 'course']),
          programs: [period.program].filter(Boolean),
          courses: [period.course].filter(Boolean),
        })) || []
      ),
    [cache, periodsResponse]
  );

  const academicCalendarPeriods = useAcademicCalendarPeriods({ classes });

  const periods = useMemo(() => {
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
          if (selectedClass.substages?.length) {
            // If only certain substage matches
            const substageIds = selectedClass?.substages?.map((s) => s.id);
            const selectedClassCourses = Array.isArray(selectedClass?.courses)
              ? selectedClass?.courses.map((c) => c.id)
              : selectedClass?.courses?.id;

            if (
              !selectedClassCourses.some((course) =>
                substageIds.some(
                  (substage) => period?.periods?.[selectedClass.program]?.[course] === substage
                )
              )
            ) {
              return false;
            }
          }

          return (
            period.programs.includes(selectedClass.program) &&
            (selectedClass.courses?.id
              ? period.courses.includes(selectedClass.courses?.id)
              : intersection(
                  period.courses,
                  selectedClass.courses.map((c) => c.id)
                ).length > 0)
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

  const { startDate, endDate } = useAcademicCalendarDates({ selectedClass });
  const [t] = useTranslateLoader(prefixPN('scoresPage.filters.period'));

  const finalPeriods = useMemo(() => {
    if (!selectedClass || !startDate || !endDate) {
      return periods;
    }

    const hasAcademicCalendarPeriods = periods.some(
      (p) => p.group === periodTypes?.academicCalendar
    );

    if (hasAcademicCalendarPeriods) {
      return periods;
    }

    const customPeriod = {
      courses: [selectedClass.courses.id],
      programs: [selectedClass.program],
      periods: {
        [selectedClass.program]: {
          [selectedClass.courses.id]: 'fullCourse',
        },
      },
      startDate,
      endDate,
      name: t('fullCourse'),
      id: 'fullCourse',
    };

    return [customPeriod, ...periods];
  }, [periods, periodTypes, selectedClass, startDate, endDate, t]);

  return {
    periods: finalPeriods,
    isLoading,
  };
}
