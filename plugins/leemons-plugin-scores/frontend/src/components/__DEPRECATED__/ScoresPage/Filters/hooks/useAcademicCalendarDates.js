import { isArray } from 'lodash';
import { useAcademicCalendarConfig } from '@academic-calendar/hooks';

export default function useAcademicCalendarDates({ selectedClass }) {
  const { program, courses } = selectedClass ?? {};
  const isSingleCourse = !isArray(courses) || courses.length === 1;
  const courseId = courses?.id ?? courses?.[0]?.id ?? null;

  const { data: academicCalendar, isLoading } = useAcademicCalendarConfig(program, {
    enabled: !!program,
  });

  if (isLoading || !courseId) {
    return {};
  }

  const { startDate, endDate } = academicCalendar?.courseDates?.[courseId] ?? {};

  return isSingleCourse
    ? {
        startDate: startDate?.getTime() ?? null,
        endDate: endDate?.getTime() ?? null,
      }
    : {
        startDate: null,
        endDate: null,
      };
}
