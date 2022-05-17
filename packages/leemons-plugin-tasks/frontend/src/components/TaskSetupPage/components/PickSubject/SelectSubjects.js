import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { find, map } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, TableInput, Select } from '@bubbles-ui/components';
import useTableInputLabels from '../../../../helpers/useTableInputLabels';
import useProgram from '../../../Student/TaskDetail/helpers/useProgram';

function useProgramSubjects(programId) {
  const program = useProgram(programId);

  if (program) {
    return map(program?.subjects, ({ name, id }) => ({
      // TODO: Incluir el curso y grupo en el label
      label: name,
      value: id,
    }));
  }

  return [];
}

function useDifficultyLevels(labels) {
  return useMemo(
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
}

function useSubjectColumns({ labels, placeholders, errorMessages, subjects }) {
  const difficultyLevels = useDifficultyLevels(labels);

  return useMemo(() => {
    const columns = [];

    columns.push({
      Header: labels?.subject,
      accessor: 'subject',
      input: {
        node: (
          <Select
            data={subjects}
            placeholder={placeholders?.subject}
            disabled={!subjects?.length}
            searchable
            required
          />
        ),
        rules: { required: errorMessages?.subject?.required },
      },
      valueRender: (v) => find(subjects, { value: v })?.label,
    });

    columns.push({
      Header: labels?.level,
      accessor: 'level',
      input: {
        node: (
          <Select
            data={difficultyLevels}
            placeholder={placeholders?.level}
            required
            disabled={!subjects?.length}
          />
        ),
        rules: { required: errorMessages?.level?.required },
      },
      valueRender: (v) => find(difficultyLevels, { value: v })?.label,
    });

    return columns;
  }, [labels, subjects, difficultyLevels]);
}

export default function SelectSubjects({
  labels,
  placeholders,
  errorMessages,
  value,
  onChange,
  errors,
}) {
  const tableInputLabels = useTableInputLabels();

  const { control, getValues } = useFormContext();
  const programId = useWatch({ name: 'program', control, defaultValue: getValues('program') });

  const subjects = useProgramSubjects(programId);

  const subjectsColumns = useSubjectColumns({ labels, placeholders, errorMessages, subjects });

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
