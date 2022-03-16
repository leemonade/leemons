import React, { useEffect, useState, useMemo } from 'react';
import { isNil, find, map } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, TableInput, Select } from '@bubbles-ui/components';
import { detailProgramRequest } from '@academic-portfolio/request';

export default function SelectSubjects({
  value,
  program: programId,
  labels,
  placeholders,
  errors,
  onChange,
}) {
  if (!programId) {
    return null;
  }

  const [program, setProgram] = useState({});

  useEffect(async () => {
    const details = await detailProgramRequest(programId);
    setProgram(details?.program);
  }, [programId]);

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

  // TRANSLATE: Add localization to TableInput labels
  const subjectsLabels = useMemo(
    () => ({
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
    }),
    [labels]
  );

  // TRANSLATE: Localizate the level of difficulty
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
  const subjectsColumns = useMemo(() => {
    const columns = [];

    if (!isNil(program) && program?.maxNumberOfCourses > 1) {
      columns.push({
        Header: labels.course,
        accessor: 'course',
        input: {
          node: <Select data={selects?.courses} placeholder={placeholders?.course} required />,
          // TRANSLATE: Localizate the required field
          rules: { required: 'Required field' },
        },
        valueRender: (v) => find(selects?.courses, { value: v })?.label,
      });
    }

    columns.push({
      Header: labels?.subject,
      accessor: 'subject',
      input: {
        node: (
          <Select
            data={selects?.subjects}
            placeholder={placeholders?.subject}
            disabled={!selects?.subjects?.length}
            required
          />
        ),
        // TRANSLATE: Localizate the required field
        rules: { required: 'Required field' },
      },
      valueRender: (v) => find(selects?.subjects, { value: v })?.label,
    });

    columns.push({
      Header: labels?.level,
      accessor: 'level',
      input: {
        node: (
          <Select
            data={levelsList}
            placeholder={placeholders?.level}
            required
            disabled={!selects?.subjects?.length}
          />
        ),
        // TRANSLATE: Localizate the required field
        rules: { required: 'Required field' },
      },
      valueRender: (v) => find(levelsList, { value: v })?.label,
    });
    return columns;
  }, [labels, program]);

  return (
    /* Subject container */
    <ContextContainer title={labels?.subjects}>
      <TableInput
        data={value}
        onChange={onChange}
        columns={subjectsColumns}
        labels={subjectsLabels}
        unique
        sortable
        error={errors?.subjects}
      />
    </ContextContainer>
  );
}

SelectSubjects.propTypes = {
  value: PropTypes.array,
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
