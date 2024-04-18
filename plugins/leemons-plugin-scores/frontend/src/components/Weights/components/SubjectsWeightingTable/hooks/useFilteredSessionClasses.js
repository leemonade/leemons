import { useMemo } from 'react';

import { filter } from 'lodash';

import { useSessionClasses } from '@academic-portfolio/hooks';

export default function useFilteredSessionClasses({ program, subject, course }) {
  const { data: sessionClasses, isLoading: isLoadingSessionClasses } = useSessionClasses(
    { program },
    { enabled: !!program }
  );

  const filteredSessionClasses = useMemo(
    () =>
      filter(sessionClasses, (klass) => {
        if (subject) {
          return klass.subject.id === subject;
        }

        if (course) {
          return [klass.courses].flat().some((_course) => _course.id === course);
        }

        return true;
      }),
    [sessionClasses, subject, course]
  );

  return {
    data: filteredSessionClasses,
    isLoading: isLoadingSessionClasses,
  };
}
