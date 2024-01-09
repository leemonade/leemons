import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { findIndex, noop, uniq } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { ActionButton, Box, Button, InputWrapper, Select, Table } from '@bubbles-ui/components';
import { AddCircleIcon, DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { Container } from '@assignables/components/Assignment/components/Container';
import { useDataForSubjectPicker } from './hooks/useDataForSubjectPicker';
import { useSubjectPickerStyles } from './SubjectPicker.styles';

export function SubjectPicker({
  assignable,
  localizations,
  value,
  onChange,
  onChangeRaw = noop,
  error,
  hideSectionHeaders,
  onlyOneSubject,
  ...props
}) {
  const form = useForm({
    defaultValues: {
      program: undefined,
      course: undefined,
      subject: undefined,
      selectedSubjects: value || [],
    },
  });

  const { programs, courses, subjects, selectedSubjects } = useDataForSubjectPicker({
    subjects: assignable?.subjects || value,
    control: form.control,
  });

  useEffect(() => {
    form.setValue('selectedSubjects', value || []);
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onChangeRaw(selectedSubjects);
  }, [selectedSubjects]);

  const { classes } = useSubjectPickerStyles();

  const onSubmit = ({ selectedSubjects, ...newSubject }) => {
    const newSelectedSubjects = [newSubject?.subject, ...selectedSubjects];
    form.setValue('selectedSubjects', uniq(newSelectedSubjects));
    onChange(newSelectedSubjects);

    return false;
  };

  const onRemove = ({ id }) => {
    const selSubjects = form.getValues('selectedSubjects');

    const index = findIndex(selSubjects, (subject) => subject === id);

    if (index >= 0) {
      const newSelectedSubjects = [...selSubjects];
      newSelectedSubjects.splice(index, 1);
      form.setValue('selectedSubjects', newSelectedSubjects);
      onChange(newSelectedSubjects);
    }
  };

  return (
    <Container title={localizations?.title} hideSectionHeaders={hideSectionHeaders}>
      <Box className={classes.subjectPicker}>
        <Controller
          control={form.control}
          name="program"
          render={({ field }) => (
            <Select
              {...field}
              cleanOnMissingValue
              label={localizations?.program}
              placeholder={localizations?.placeholder}
              data={programs}
              disabled={!programs?.length}
            />
          )}
        />
        {courses !== null && (
          <Controller
            control={form.control}
            name="course"
            shouldUnregister
            render={({ field }) => (
              <Select
                {...field}
                cleanOnMissingValue
                label={localizations?.course}
                placeholder={localizations?.placeholder}
                data={courses}
                disabled={!courses?.length}
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="subject"
          render={({ field }) => (
            <Select
              {...field}
              cleanOnMissingValue
              label={localizations?.subject}
              placeholder={localizations?.placeholder}
              data={subjects}
              disabled={!subjects?.length}
            />
          )}
        />

        <Button leftIcon={<AddCircleIcon />} variant="link" onClick={form.handleSubmit(onSubmit)}>
          {localizations?.add}
        </Button>
      </Box>
      <InputWrapper mt={4} error={error} />
      <Box className={classes.table}>
        <Table
          data={selectedSubjects.map((subject) => ({
            ...subject,
            course: subject?.course ?? '-',
            action: <ActionButton icon={<DeleteBinIcon />} onClick={() => onRemove(subject)} />,
          }))}
          columns={[
            {
              Header: '',
              accessor: 'program',
            },
            {
              Header: '',
              accessor: 'course',
            },
            {
              Header: '',
              accessor: 'subject',
            },
            {
              Header: '',
              accessor: 'action',
            },
          ]}
        />
      </Box>
    </Container>
  );
}

SubjectPicker.propTypes = {
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  onChange: PropTypes.func,
  onChangeRaw: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
  onlyOneSubject: PropTypes.bool,
};

export default SubjectPicker;
