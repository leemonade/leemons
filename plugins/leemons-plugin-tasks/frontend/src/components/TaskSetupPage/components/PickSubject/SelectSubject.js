import React, { useEffect, useState, useMemo } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, Select } from '@bubbles-ui/components';
import { detailProgramRequest } from '@academic-portfolio/request';

export default function SelectSubject({
  value: userValue,
  program: programId,
  labels,
  placeholders,
  onChange,
}) {
  if (!programId) {
    return null;
  }

  /**
   * STATE HOOKS
   */
  const [value, setValue] = useState(userValue);
  const [program, setProgram] = useState({});

  /**
   * EFFECT HOOKS
   */
  useEffect(() => {
    setValue(userValue);
  }, [userValue]);

  useEffect(() => {
    (async () => {
      const details = await detailProgramRequest(programId);
      setProgram(details?.program);
    })();
  }, [programId]);

  /**
   * HANDLERS
   */
  const handleChange = (key) => (newValue) => {
    if (userValue === undefined) {
      setValue((v) => ({
        ...v,
        [key]: newValue,
      }));
    }

    onChange({ ...value, [key]: newValue });
  };

  /**
   * MEMOIZED VALUES
   */
  const selects = useMemo(
    () => ({
      courses: map(program?.courses, ({ name, index, id }) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
      subjects: map(program?.subjects, ({ name, id }) => ({
        label: name,
        value: id,
      })),
    }),
    [program]
  );

  // TRANSLATE: Add level labels
  const levelsList = useMemo(
    () => [
      {
        label: 'Beginner',
        value: 'beginner',
      },
      {
        label: 'Intermediate',
        value: 'intermediate',
      },
    ],
    []
  );

  return (
    /* Subject container */
    <ContextContainer direction="row">
      <Select
        label={labels?.course}
        placeholder={placeholders?.course}
        data={selects.courses}
        onChange={handleChange('course')}
        value={value?.course}
      />
      <Select
        label={labels?.subject}
        placeholder={placeholders?.subject}
        data={selects.subjects}
        onChange={handleChange('subject')}
        value={value?.subject}
      />
      <Select
        label={labels?.level}
        placeholder={placeholders?.level}
        data={levelsList}
        onChange={handleChange('level')}
        value={value?.level}
      />
    </ContextContainer>
  );
}

SelectSubject.propTypes = {
  value: PropTypes.shape({
    course: PropTypes.string,
    subject: PropTypes.string,
    level: PropTypes.string,
  }),
  program: PropTypes.string,
  labels: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
    course: PropTypes.string,
    subject: PropTypes.string,
    level: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
    course: PropTypes.string,
    subject: PropTypes.string,
    level: PropTypes.string,
  }),
  errors: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
