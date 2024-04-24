import { useMemo } from 'react';

import { filter, map, uniqBy } from 'lodash';

import { useSessionClasses } from '@academic-portfolio/hooks';

export default function useMyScoresSubjects({ program, course }) {
  const { data: classes, isLoading } = useSessionClasses({ program });

  const filteredClasses = useMemo(() => filter(classes, 'courses.id', course), [classes, course]);
  const subjects = useMemo(() => uniqBy(map(filteredClasses, 'subject'), 'id'), [filteredClasses]);

  return { data: subjects, isLoading };
}
