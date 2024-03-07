import { useMemo } from 'react';
import { map, pick, sortBy, uniq } from 'lodash';
import { useProgramsPublicInfo } from '@academic-portfolio/hooks';

export function useProgramsForSubjectPicker({ subjects }) {
  const programIds = uniq(map(subjects, 'program'));

  const { data, isLoading } = useProgramsPublicInfo(programIds, {
    enabled: !!programIds,
  });

  return useMemo(() => {
    if (isLoading) {
      return [];
    }

    return map(data?.programs, (program) => ({
      id: program?.id,
      name: program?.name,
      courses: sortBy(program?.courses, 'index').map((course) => pick(course, ['name', 'id'])),
      hasCourses: !(program?.moreThanOneAcademicYear || program?.maxNumberOfCourses === 1),
    }));
  }, [data, isLoading]);
}

export default useProgramsForSubjectPicker;
