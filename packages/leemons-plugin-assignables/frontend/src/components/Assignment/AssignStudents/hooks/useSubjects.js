import { useMemo } from 'react';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import { useSubjectDetails } from '@academic-portfolio/hooks';

export default function useSubjects(task) {
  const { data: classes } = useSessionClasses({}, { enabled: !task?.subjects?.length });

  const subjects = useMemo(() => {
    if (task?.subjects) {
      return task?.subjects?.map(({ subject }) => subject);
    }

    return classes?.map((klass) => klass.subject.id) || [];
  }, [task?.subjects, classes]);

  const { data: subjectDetails } = useSubjectDetails(subjects, { enabled: !!subjects });

  return useMemo(
    () =>
      subjectDetails?.map((subject) => ({
        label: subject.name,
        value: subject.id,
      })) || [],
    [subjectDetails]
  );
}
