import React, { useMemo } from 'react';
import _, { find } from 'lodash';
import { useFormContext, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ContextContainer, TableInput, Select } from '@bubbles-ui/components';
import {
  SelectLevelsOfDifficulty,
  useLevelsOfDifficulty,
} from '@assignables/components/LevelsOfDifficulty';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useTableInputLabels from '../../../../helpers/useTableInputLabels';
import ConditionalInput from '../../../Inputs/ConditionalInput';

function useSubjectColumns({ labels, placeholders, errorMessages, subjects }) {
  const difficultyLevels = useLevelsOfDifficulty();
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
            autoSelectOneOption
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

  // const subjects = useProgramSubjects(programId);

  const { data: classes } = useSessionClasses({ program: programId, showType: true, type: null });

  const subjects = classes?.map((klass) => ({
    value: klass.subject.subject || klass.subject.id,
    label: klass.subject.name,
    type: klass.type,
  }));
  const uniqSubjects = _.uniqBy(subjects, 'value');

  const subjectsToUse = useMemo(() => {
    if (programId) {
      return uniqSubjects;
    }

    return null;
  }, [programId, uniqSubjects]);

  const mainTeacherSubjects = useMemo(() => {
    if (subjectsToUse) {
      return subjectsToUse.filter((subject) => subject.type === 'main-teacher');
    }

    return [];
  }, [subjectsToUse]);

  const otherTypeTeacherSubjects = useMemo(() => {
    if (subjectsToUse) {
      return subjectsToUse.filter((subject) => subject.type !== 'main-teacher');
    }

    return [];
  }, [subjectsToUse]);

  const mainTeacherSubjectsColumns = useSubjectColumns({
    labels,
    placeholders,
    errorMessages,
    subjects: mainTeacherSubjects,
  });

  const otherTypeTeacherSubjectsColumns = useSubjectColumns({
    labels,
    placeholders,
    errorMessages,
    subjects: otherTypeTeacherSubjects,
  });

  const mainTeacherValues = useMemo(() => {
    if (value) {
      return value.filter((subject) =>
        mainTeacherSubjects.find(({ value: id }) => id === subject.subject)
      );
    }

    return [];
  }, [value, mainTeacherSubjects]);

  const otherTypeTeacherValues = useMemo(() => {
    if (value) {
      return value.filter((subject) =>
        otherTypeTeacherSubjects.find(({ value: id }) => id === subject.subject)
      );
    }

    return [];
  }, [value, otherTypeTeacherSubjects]);

  const handleChange = (type) => (newValues) => {
    if (type === 'main-teacher') {
      onChange([...otherTypeTeacherValues, ...newValues]);
    } else if (type === 'other-type') {
      onChange([...mainTeacherValues, ...newValues]);
    }
  };

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (otherTypeTeacherValues.length) {
      setShow(true);
    }
  }, [otherTypeTeacherValues]);

  return (
    /* Subject container */
    <ContextContainer title={labels?.subjects}>
      <TableInput
        data={mainTeacherValues}
        onChange={handleChange('main-teacher')}
        columns={mainTeacherSubjectsColumns}
        labels={tableInputLabels}
        unique
        sortable
        error={errors?.subjects}
      />
      <ConditionalInput
        value={show}
        onChange={(newShow) => {
          if (!newShow) {
            onChange(mainTeacherValues);
          }

          setShow(newShow);
        }}
        showOnTrue
        label={labels?.showOtherSubjects}
        render={() => (
          <TableInput
            data={otherTypeTeacherValues}
            onChange={handleChange('other-type')}
            columns={otherTypeTeacherSubjectsColumns}
            labels={tableInputLabels}
            unique
            sortable
            error={errors?.subjects}
          />
        )}
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
  teacherType: PropTypes.string,
};
