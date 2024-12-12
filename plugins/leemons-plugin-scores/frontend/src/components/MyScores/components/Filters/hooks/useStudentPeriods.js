import { useWatch } from 'react-hook-form';

import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';

import { useMatchingAcademicCalendarPeriods } from '@scores/components/__DEPRECATED__/FinalNotebook/FinalScores';
import useAcademicCalendarDates from '@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useAcademicCalendarDates';

export default function useStudentPeriods({ control }) {
  const program = useWatch({ name: 'program', control });
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
