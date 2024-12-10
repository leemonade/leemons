import React from 'react';

import { isString, map, pick, uniqBy } from 'lodash';

import { useSessionClasses, useSubjectDetails } from '@academic-portfolio/hooks';

export function useSubjectsForSubjectPicker({
  subjects,
  type = ['main-teacher', 'associate-teacher'],
}) {
  // EN: If no subject is provides on the assignable, fetch all the users subjects
  // ES: Si no hay asignaturas en el asignable, pedimos todas las asignaturas del usuario
  const { data: classes } = useSessionClasses({ type }, { enabled: !subjects?.length });

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
