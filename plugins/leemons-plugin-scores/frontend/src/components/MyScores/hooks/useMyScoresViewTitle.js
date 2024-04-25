import getCourseName from '@academic-portfolio/helpers/getCourseName';
import { useCourseDetail } from '@academic-portfolio/hooks';

export default function useMyScoresViewTitle({ course, period } = {}) {
  const { data: courseData } = useCourseDetail({
    groupId: course,
    options: { enabled: !!course },
  });

  if (!courseData) {
    return null;
  }

  let title = getCourseName(courseData);

  if (period?.period?.name) {
    title += ` (${period.period.name})`;
  }
  return title;
}
