import { useMemo } from 'react';

import { useSessionClasses } from '@academic-portfolio/hooks';

export default function useClassesMatchingFilters({ program, course, subject }) {
  const { data: classes, isLoading } = useSessionClasses({ program });

  const filteredClasses = useMemo(() => {
    if (classes && (course || subject)) {
      return classes?.filter(
        (klass) =>
          (!course || klass.courses.id === course) && (!subject || klass.subject.id === subject)
      );
    }

    return classes;
  }, [classes, course, subject]);

  return { classes: filteredClasses ?? [], isLoading };
}
