import { useMemo } from 'react';

import { isString, map, pick, uniqBy } from 'lodash';

import { useSubjectDetails } from '@academic-portfolio/hooks';
import useUserAgentSubjects from '@academic-portfolio/hooks/queries/useUserAgentSubjects';

export function useSubjectsForSubjectPicker({
  subjects,
  type = ['main-teacher', 'associate-teacher'],
}) {
  const { data: userAgentSubjects } = useUserAgentSubjects({
    teacherTypeFilter: type,
    options: { enabled: !subjects?.length },
  });

  const subjectsIds = useMemo(() => {
    if (subjects?.length) {
      return subjects?.map((subject) => (isString(subject) ? subject : subject.subject));
    }

    return userAgentSubjects?.map((subject) => subject.id) || [];
  }, [subjects, userAgentSubjects]);

  const { data: fetchedSubjectDetails } = useSubjectDetails(subjectsIds, {
    enabled: !!subjectsIds?.length,
  });

  return useMemo(
    () =>
      uniqBy(
        map(fetchedSubjectDetails, (subject) =>
          pick(subject, ['id', 'name', 'program', 'courses', 'color'])
        ),
        'id'
      ) || [],
    [fetchedSubjectDetails]
  );
}

export default useSubjectsForSubjectPicker;
