import { isArray } from 'lodash';
import { useAcademicCalendarConfig } from '@academic-calendar/hooks';

export default function useAcademicCalendarDates({ selectedClass }) {
  const { program, courses } = selectedClass ?? {};
  const isSingleCourse = !isArray(courses) || courses.length === 1;
  const courseId = courses?.id ?? courses?.[0]?.id ?? null;

  const { data: academicCalendar } = useAcademicCalendarConfig(program, {
    enabled: !!program,
  });

  const { startDate, endDate } = academicCalendar?.courseDates?.[courseId] ?? {};

  return isSingleCourse
    ? {
        startDate: startDate?.getTime(),
        endDate: endDate?.getTime(),
      }
    : {};
}