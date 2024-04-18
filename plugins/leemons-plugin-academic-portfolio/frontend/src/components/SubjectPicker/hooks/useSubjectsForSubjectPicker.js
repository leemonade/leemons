import React from 'react';
import { useSessionClasses, useSubjectDetails } from '@academic-portfolio/hooks';
import { isString, map, pick, uniqBy } from 'lodash';

export function useSubjectsForSubjectPicker({ subjects }) {
  // EN: If no subject is provides on the assignable, fetch all the users subjects
  // ES: Si no hay asignaturas en el asignable, pedimos todas las asignaturas del usuario
  const { data: classes } = useSessionClasses({}, { enabled: !subjects?.length });

  const subjectsIds = React.useMemo(() => {
    if (subjects?.length) {
      return subjects?.map((subject) => (isString(subject) ? subject : subject.subject));
    }

    return classes?.map((klass) => klass.subject.id) || [];
  }, [subjects, classes]);

  const { data: subjectDetails } = useSubjectDetails(subjectsIds, {
    enabled: !!subjectsIds?.length,
  });

  return React.useMemo(
    () =>
      uniqBy(
        map(subjectDetails, (subject) =>
          pick(subject, ['id', 'name', 'program', 'courses', 'color'])
        ),
        'id'
      ) || [],
    [subjectDetails]
  );
}

export default useSubjectsForSubjectPicker;
