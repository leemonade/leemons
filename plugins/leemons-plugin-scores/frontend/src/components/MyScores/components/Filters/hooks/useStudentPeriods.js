import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { useMatchingAcademicCalendarPeriods } from '@scores/components/__DEPRECATED__/FinalNotebook/FinalScores';
import useAcademicCalendarDates from '@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useAcademicCalendarDates';
import { prefixPN } from '@scores/helpers';

export default function useStudentPeriods({ control }) {
  const program = useWatch({ name: 'program', control });
  const course = useWatch({ name: 'course', control });

  const [t] = useTranslateLoader(prefixPN('scoresPage.filters.period'));

  const { data: classesData, isLoading: classesLoading } = useProgramClasses(program, {
    enabled: !!program,
  });
  const { periods, isLoading: periodsLoading } = useMatchingAcademicCalendarPeriods({
    classes: classesData,
    filters: { program, course },
  });

  const { startDate, endDate } = useAcademicCalendarDates({
    control,
    selectedClass: { program, courses: { id: course } },
  });

  const academicDatesLoading = startDate === undefined || endDate === undefined;

  const finalPeriods = useMemo(() => {
    if (!startDate || !endDate) {
      return [];
    }

    if (periods.length) {
      return [
        ...periods,
        {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          id: 'final',
          name: t('final'),
        },
      ];
    }

    return [
      {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        id: 'fullCourse',
        name: t('fullCourse'),
      },
    ];
  }, [periods, startDate, endDate, t]);

  return {
    periods: finalPeriods,
    startDate,
    endDate,
    isLoading: classesLoading || periodsLoading || academicDatesLoading,
  };
}
