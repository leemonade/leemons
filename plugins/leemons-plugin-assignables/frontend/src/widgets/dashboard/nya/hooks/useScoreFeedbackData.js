import { useMemo } from 'react';

import { useClassesSubjects } from '@academic-portfolio/hooks';
import PropTypes from 'prop-types';

export default function useScoreFeedbackData({ assignation, subject }) {
  const { instance } = assignation ?? {};
  const subjects = useClassesSubjects(instance?.classes);

  const program = useMemo(
    () => subjects?.find((s) => s.id === subject)?.program,
    [subjects, subject]
  );

  const score = useMemo(
    () =>
      assignation?.grades?.find((grade) => grade.type === 'main' && grade.subject === subject)
        ?.grade,
    [assignation?.grades, subject]
  );

  return {
    program,
    score,
    instance,
  };
}

useScoreFeedbackData.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      id: PropTypes.string,
      classes: PropTypes.arrayOf(PropTypes.string),
    }),
    grades: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        subject: PropTypes.string,
        grade: PropTypes.number,
      })
    ),
  }),
  subject: PropTypes.string,
};
