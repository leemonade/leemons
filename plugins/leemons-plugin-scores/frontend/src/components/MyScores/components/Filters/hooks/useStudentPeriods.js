import { useWatch } from 'react-hook-form';

import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import { useMatchingAcademicCalendarPeriods } from '@scores/components/FinalNotebook/FinalScores';
import useAcademicCalendarDates from '@scores/components/ScoresPage/Filters/hooks/useAcademicCalendarDates';
import { getSessionConfig } from '@users/session';

export default function useStudentPeriods({ control }) {
  const { program } = getSessionConfig();
  const course = useWatch({ name: 'course', control });

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

  return {
    periods,
    startDate,
    endDate,
    isLoading: classesLoading || periodsLoading || academicDatesLoading,
  };
}
