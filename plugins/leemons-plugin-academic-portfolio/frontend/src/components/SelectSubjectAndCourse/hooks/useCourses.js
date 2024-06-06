import { useMemo } from 'react';

import { useSessionClasses } from '@academic-portfolio/hooks';
import { filter, flatMap, sortBy, uniqBy } from 'lodash';

export default function useCourses({ program, subject }) {
  const { data: classes } = useSessionClasses({ program, withProgram: true });

  const courses = useMemo(
    () =>
      sortBy(
        uniqBy(
          flatMap(filter(classes, { subject: { subject } }), (klass) => klass.courses),
          'id'
        ),
        'index'
      ),
    [classes, subject]
  );

  return { courses };
}
