import React, { useMemo } from 'react';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, TableInput } from '@bubbles-ui/components';
import {
  SelectLevelsOfDifficulty,
  useLevelsOfDifficulty,
} from '@assignables/components/LevelsOfDifficulty';
import {
  SelectAutoClearable,
  useSubjects,
} from '@assignables/hooks/useAcademicFiltersForAssetList';
import useTableInputLabels from '../helpers/useTableInputLabels';

function useSubjectColumns({ labels, placeholders, errorMessages, subjects, showLevel }) {
  const difficultyLevels = useLevelsOfDifficulty();

  return useMemo(() => {
    const columns = [];

    columns.push({
      Header: labels?.subject || '',
      accessor: 'subject',
      input: {
        node: (
          <SelectAutoClearable
            data={subjects}
            placeholder={labels?.subject}
            disabled={!subjects.length}
          />
        ),
        rules: { required: errorMessages?.subject?.required },
      },
      valueRender: (v) => find(subjects, { value: v })?.label,
    });

    if (showLevel) {
      columns.push({
        Header: labels?.level || '',
        accessor: 'level',
        input: {
          node: (
            <SelectLevelsOfDifficulty
              placeholder={placeholders?.level}
              required
              disabled={!subjects?.length}
            />
          ),
          rules: { required: errorMessages?.level?.required },
        },
        valueRender: (v) => find(difficultyLevels, { value: v })?.label,
      });
    }

    return columns;
  }, [labels, subjects, difficultyLevels]);
}

export default function SelectSubjects({
  programId,
  labels,
  placeholders,
  errorMessages,
  maxOne,
  showLevel,
  value,
  onChange,
  errors,
}) {
  const tableInputLabels = useTableInputLabels();
  const subjects = useSubjects({ labels, selectedProgram: programId, useAll: false });

  const mainTeacherSubjectsColumns = useSubjectColumns({
    labels,
    placeholders,
    errorMessages,
    subjects,
    showLevel,
  });

  return (
    /* Subject container */
    <ContextContainer>
      <TableInput
        data={value || []}
        onChange={onChange}
        columns={mainTeacherSubjectsColumns}
        labels={tableInputLabels}
        unique
        sortable={false}
        disabledAddButton={!!(maxOne && value?.length)}
        error={errors?.subjects}
      />
    </ContextContainer>
  );
}

SelectSubjects.propTypes = {
  value: PropTypes.array,
  programId: PropTypes.string,
  labels: PropTypes.shape({
    subjects: PropTypes.string,
    summary: PropTypes.string,
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
    subject: PropTypes.string,
    level: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
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
  maxOne: PropTypes.bool,
  showLevel: PropTypes.bool,
  onChange: PropTypes.func,
  teacherType: PropTypes.string,
};
