import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, CheckBoxGroup } from '@bubbles-ui/components';
import { useSubjects } from '../hooks';

export default function SubjectSelector({ labels, onChange, value, task }) {
  const subjects = useSubjects(task);

  if (subjects.length <= 1) {
    const subject = subjects[0];
    if (subject && !(value?.length === 1 && value[0] === subject.value)) {
      onChange([subject.value]);
    }
    return null;
  }

  return (
    <ContextContainer title={labels?.subjects?.title} subtitle={labels?.subjects?.subtitle}>
      <CheckBoxGroup variant="boxed" data={subjects} value={value} onChange={onChange} />
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
  task: PropTypes.shape({
    subjects: PropTypes.arrayOf(
      PropTypes.shape({
        subject: PropTypes.string,
      })
    ),
  }).isRequired,
};
