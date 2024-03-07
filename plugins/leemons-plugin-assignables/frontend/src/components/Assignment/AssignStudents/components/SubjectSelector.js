import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, CheckBoxGroup } from '@bubbles-ui/components';
import { useSubjects } from '../hooks';

export default function SubjectSelector({ labels, onChange, value, assignable }) {
  const subjects = useSubjects(assignable);

  const subjectsProcessed = React.useMemo(
    () =>
      subjects.map((subject) => ({
        ...subject,
        checked: value?.includes(subject.value),
      })),
    [subjects, value]
  );

  if (subjects.length <= 1) {
    const subject = subjects[0];
    if (subject && !(value?.length === 1 && value[0] === subject.value)) {
      onChange([subject.value]);
    }
    return null;
  }

  return (
    <ContextContainer
      title={
        assignable?.subjects?.length
          ? labels?.subjects?.calificableTitle
          : labels?.subjects?.nonCalificableTitle
      }
      subtitle={labels?.subjects?.subtitle}
    >
      <CheckBoxGroup variant="boxed" data={subjectsProcessed} onChange={onChange} />
    </ContextContainer>
  );
}

SubjectSelector.propTypes = {
  labels: PropTypes.shape({
    subjects: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
    }).isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  assignable: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        subject: PropTypes.string,
      })
    ),
  }).isRequired,
};
