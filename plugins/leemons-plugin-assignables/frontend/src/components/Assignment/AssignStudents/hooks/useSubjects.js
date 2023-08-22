import { useMemo } from 'react';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import { useSubjectDetails } from '@academic-portfolio/hooks';
import { uniqBy } from 'lodash';

export default function useSubjects(task, useAllSubjects = true) {
  const { data: classes } = useSessionClasses({}, { enabled: !task?.subjects?.length });

  const subjects = useMemo(() => {
    if (task?.subjects) {
      return task?.subjects?.map(({ subject }) => subject);
    }

    if (!useAllSubjects) {
      return [];
    }

    return classes?.map((klass) => klass.subject.id) || [];
  }, [task?.subjects, classes]);

  const { data: subjectDetails } = useSubjectDetails(subjects, { enabled: !!subjects });

  return useMemo(
    () =>
      uniqBy(
        subjectDetails?.map((subject) => ({
          label: subject.name,
          value: subject.id,
        })),
        'value'
      ) || [],
    [subjectDetails]
  );
}
