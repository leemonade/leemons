import React, { useEffect, useState, useMemo } from 'react';
import { isNil, find, map } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, TableInput, Select } from '@bubbles-ui/components';
import { detailProgramRequest } from '@academic-portfolio/request';
import useTableInputLabels from '../../../../helpers/useTableInputLabels';

export default function SelectSubjects({
  value,
  program: programId,
  labels,
  placeholders,
  errorMessages,
  errors,
  onChange,
}) {
  if (!programId) {
    return null;
  }
  const tableInputLabels = useTableInputLabels();

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

  // TRANSLATE: Level labels
  const levelsList = useMemo(
    () => [
      {
        label: labels.levelValues.begginer,
        value: 'beginner',
      },
      {
        label: labels.levelValues.intermediate,
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
          rules: { required: errorMessages?.course?.required },
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
        rules: { required: errorMessages?.subject?.required },
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
        rules: { required: errorMessages?.level?.required },
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
        labels={tableInputLabels}
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
    levelValues: PropTypes.shape({
      begginer: PropTypes.string,
      intermediate: PropTypes.string,
    }),
    tableInput: PropTypes.shape({
      add: PropTypes.string,
      remove: PropTypes.string,
      edit: PropTypes.string,
      accept: PropTypes.string,
      cancel: PropTypes.string,
    }),
  }),
  placeholders: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
    course: PropTypes.string,
    subject: PropTypes.string,
    level: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    course: PropTypes.shape({
      required: PropTypes.string,
    }),
    subject: PropTypes.shape({
      required: PropTypes.string,
    }),
    level: PropTypes.shape({
      required: PropTypes.string,
    }),
  }),
  errors: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
