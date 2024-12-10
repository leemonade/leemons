import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  ActionButton,
  Box,
  Stack,
  Button,
  InputWrapper,
  Select,
  Table,
  ContextContainer,
} from '@bubbles-ui/components';
import { AddCircleIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { useLayout } from '@layout/context';
import { updateSessionConfig } from '@users/session';
import { findIndex, isString, noop, sortBy, uniq } from 'lodash';
import PropTypes from 'prop-types';

import { useSubjectPickerStyles } from './SubjectPicker.styles';
import { useDataForSubjectPicker } from './hooks/useDataForSubjectPicker';

function useSelectInitialSubjects({ selectInitialSubjects, assignable, form, onChange }) {
  const subjects = assignable?.subjects;
  const subjectsIds = useMemo(() => {
    if (subjects?.length) {
      return subjects?.map((subject) => (isString(subject) ? subject : subject.subject));
    }
    return [];
  });

  useEffect(() => {
    if (
      selectInitialSubjects &&
      subjectsIds.length &&
      !form.getValues('selectedSubjects')?.length &&
      !form.formState.isDirty
    ) {
      form.setValue('selectedSubjects', subjectsIds, { shouldDirty: true });
      onChange(subjectsIds);
    }
  }, [subjectsIds]);
}

export function SubjectPicker({
  assignable,
  localizations,
  value,
  onChange = noop,
  onChangeRaw = noop,
  error,
  onlyOneSubject,
  selectInitialSubjects,
  teacherType = ['main-teacher', 'associate-teacher'],
}) {
  const { openConfirmationModal } = useLayout();

  const form = useForm({
    defaultValues: {
      program: undefined,
      course: undefined,
      subject: undefined,
      selectedSubjects: value || [],
    },
  });

  const { programs, courses, subjects, selectedSubjects } = useDataForSubjectPicker({
    subjects: assignable?.subjects,
    control: form.control,
    teacherType,
  });

  const sortedPrograms = sortBy(programs, 'createdAt');
  const sortedSubjects = sortBy(subjects, 'createdAt');

  useSelectInitialSubjects({ selectInitialSubjects, assignable, form, onChange });

  useEffect(() => {
    form.setValue('selectedSubjects', value || []);
    onChange(value || []);
  }, [JSON.stringify(value)]);

  useEffect(() => {
    onChangeRaw(selectedSubjects);
  }, [JSON.stringify(selectedSubjects)]);

  const { classes } = useSubjectPickerStyles({}, { name: 'SubjectPicker' });

  const isDisabled = useMemo(() => {
    if (onlyOneSubject) {
      return selectedSubjects?.length;
    }
    return false;
  }, [onlyOneSubject, selectedSubjects]);

  const onSubmit = ({ selectedSubjects: data, ...newSubject }) => {
    if (!newSubject?.subject) {
      return null;
    }
    const newSelectedSubjects = [newSubject?.subject ?? [], ...data];
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

  const columns = React.useMemo(() => {
    const result = [
      {
        Header: '',
        accessor: 'program',
        style: {
          width: courses ? '30%' : '45%',
        },
      },
    ];
    if (courses) {
      result.push({
        Header: '',
        accessor: 'course',
        style: {
          width: '30%',
        },
      });
    }

    result.push(
      {
        Header: '',
        accessor: 'subject',
        style: {
          width: courses ? '30%' : '45%',
        },
      },
      {
        Header: '',
        accessor: 'action',
        style: {
          width: '10%',
        },
      }
    );
    return result;
  }, [courses]);

  return (
    <ContextContainer title={localizations?.title} spacing={0}>
      <InputWrapper error={error}>
        <Stack fullWidth className={classes.subjectPicker}>
          <Box>
            <Controller
              control={form.control}
              name="program"
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={(program) => {
                    const prevProgram = form.getValues('program');
                    const pickedSubjects = form.getValues('selectedSubjects');

                    if (program && program !== prevProgram && pickedSubjects.length) {
                      return openConfirmationModal({
                        title: localizations?.programChangeModal?.title,
                        description: localizations?.programChangeModal?.description,
                        onConfirm: async () => {
                          form.setValue('selectedSubjects', []);
                          onChange([]);

                          updateSessionConfig({ program });
                          field.onChange(program);
                        },
                      })();
                    }

                    if (program) {
                      updateSessionConfig({ program });
                    }
                    return field.onChange(program);
                  }}
                  cleanOnMissingValue
                  label={localizations?.program}
                  placeholder={localizations?.placeholder}
                  data={sortedPrograms}
                  disabled={!sortedPrograms?.length || isDisabled}
                />
              )}
            />
          </Box>

          {courses !== null && (
            <Box>
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
                    disabled={!courses?.length || isDisabled}
                  />
                )}
              />
            </Box>
          )}
          <Box>
            <Controller
              control={form.control}
              name="subject"
              render={({ field }) => (
                <Select
                  {...field}
                  cleanOnMissingValue
                  label={localizations?.subject}
                  placeholder={localizations?.placeholder}
                  data={sortedSubjects}
                  disabled={!sortedSubjects?.length || isDisabled}
                />
              )}
            />
          </Box>
          <Box noFlex>
            <Button
              leftIcon={<AddCircleIcon />}
              variant="link"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isDisabled}
            >
              {localizations?.add}
            </Button>
          </Box>
        </Stack>
      </InputWrapper>
      {selectedSubjects?.length > 0 ? (
        <Box className={classes.table}>
          <Table
            data={selectedSubjects.map((subject) => ({
              ...subject,
              course: subject?.course ?? '-',
              action: (
                <ActionButton
                  icon={<DeleteBinIcon width={18} height={18} />}
                  onClick={() => onRemove(subject)}
                />
              ),
            }))}
            columns={columns}
          />
        </Box>
      ) : null}
    </ContextContainer>
  );
}

SubjectPicker.propTypes = {
  localizations: PropTypes.object,
  assignable: PropTypes.object,
  onChange: PropTypes.func,
  onChangeRaw: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.any,
  onlyOneSubject: PropTypes.bool,
  selectInitialSubjects: PropTypes.bool,
  teacherType: PropTypes.arrayOf(PropTypes.string),
};

export default SubjectPicker;
