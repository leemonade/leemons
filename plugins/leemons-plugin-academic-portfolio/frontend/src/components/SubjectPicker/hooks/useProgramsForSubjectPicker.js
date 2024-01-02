import { useProgramDetail } from '@academic-portfolio/hooks';
import { map, pick, sortBy, uniq } from 'lodash';
import { useMemo } from 'react';

export function useProgramsForSubjectPicker({ subjects }) {
  const programIds = uniq(map(subjects, 'program'));

  const queries = useProgramDetail(programIds, { enabled: !!programIds });

  const isLoading = useMemo(() => queries.some((query) => query.isLoading));
  return useMemo(() => {
    if (isLoading) {
      return [];
    }

    return map(queries, ({ data }) => ({
      id: data?.id,
      name: data?.name,
      courses: sortBy(data?.courses, 'index').map((course) => pick(course, ['name', 'id'])),
      hasCourses: !(data?.moreThanOneAcademicYear || data?.maxNumberOfCourses === 1),
    }));
  }, [queries]);
}

export default useProgramsForSubjectPicker;
