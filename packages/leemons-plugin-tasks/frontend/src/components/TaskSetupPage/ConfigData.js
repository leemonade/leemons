import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty, isNil, find, isArray, map } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Stack,
  ContextContainer,
  TextInput,
  Button,
  Select,
  Textarea,
  TableInput,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { SelectProgram, SelectCourse, SelectSubject } from '@academic-portfolio/components';
import { detailProgramRequest } from '@academic-portfolio/request';
import { SelectCenter } from '@users/components';

function ConfigData({
  labels,
  placeholders,
  helps,
  errorMessages,
  onNext,
  sharedData,
  setSharedData,
  editable,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    ...sharedData,
    subjects: [],
  };

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const { subscribe, unsubscribe, emitEvent } = useObserver();
  const [centerId, setCenterId] = useState(null);
  const [program, setProgram] = useState({});
  const programId = watch('program');

  useEffect(() => {
    reset(sharedData);
  }, [sharedData]);

  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit((data) => {
          setSharedData(data);
          emitEvent('saveData');
        })();
      }
    };

    subscribe(f);
    return () => {
      unsubscribe(f);
    };
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  const handleOnSelectCenter = (id) => {
    setCenterId(id);
  };

  const handleOnProgramChange = async (id) => {
    try {
      const { program: detail } = await detailProgramRequest(id);
      setProgram(detail);
    } catch (err) {
      //
    }
  };

  useEffect(() => {
    if (!isEmpty(programId)) {
      handleOnProgramChange(programId);
    }
  }, [programId]);

  // ·······························································
  // SUBJECTS

  const selects = useMemo(
    () => ({
      courses: map(program.courses, ({ name, index, id }) => ({
        label: `${name ? `${name} (${index}º)` : `${index}º`}`,
        value: id,
      })),
      subjects: map(program.subjects, ({ name, id }) => ({
        label: name,
        value: id,
      })),
    }),
    [program]
  );

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

    if (!isNil(program) && program.maxNumberOfCourses > 1) {
      columns.push({
        Header: labels.course,
        accessor: 'course',
        input: {
          node: <Select data={selects.courses} placeholder={placeholders.course} required />,
          rules: { required: 'Required field' },
        },
        valueRender: (value) => find(selects.courses, { value })?.label,
      });
    }

    columns.push({
      Header: labels.subject,
      accessor: 'subject',
      input: {
        node: <Select data={selects.subjects} placeholder={placeholders.subject} required />,
        rules: { required: 'Required field' },
      },
      valueRender: (value) => find(selects.subjects, { value })?.label,
    });

    columns.push({
      Header: labels.level,
      accessor: 'level',
      input: {
        node: <Select data={levelsList} placeholder={placeholders.level} required />,
        rules: { required: 'Required field' },
      },
      valueRender: (value) => find(levelsList, { value })?.label,
    });
    return columns;
  }, [labels, program]);

  const subjectsLabels = useMemo(
    () => ({
      add: labels.addSubject,
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
    }),
    [labels]
  );

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <form onSubmit={handleSubmit(handleOnNext)}>
      <ContextContainer {...props} divided>
        <ContextContainer title={labels.title} divided>
          <ContextContainer>
            {/* Name input */}
            <Controller
              control={control}
              name="name"
              rules={{ required: errorMessages.name?.required }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={labels.name}
                  placeholder={placeholders.name}
                  error={errors.name}
                  required={!isEmpty(errorMessages.name?.required)}
                />
              )}
            />
            {/* Tagline input */}
            <Controller
              control={control}
              name="tagline"
              rules={{ required: errorMessages.tagline?.required }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={labels.tagline}
                  placeholder={placeholders.tagline}
                  error={errors.tagline}
                  required={!isEmpty(errorMessages.tagline?.required)}
                />
              )}
            />

            <ContextContainer direction="row">
              {/* Center Selector - MUST COME FROM A PREVIOUS SCREEN */}
              <Box skipFlex>
                <SelectCenter label="Center" onChange={handleOnSelectCenter} firstSelected />
              </Box>

              {/* Program selector */}
              <Controller
                control={control}
                name="program"
                rules={{ required: errorMessages.program?.required }}
                render={({ field }) => (
                  <SelectProgram
                    {...field}
                    center={centerId}
                    label={labels.program}
                    placeholder={placeholders.program}
                    error={errors.program}
                  />
                )}
              />
            </ContextContainer>
          </ContextContainer>

          {/* Subject container */}
          {!isEmpty(program) && (
            <ContextContainer title={labels.subjects}>
              <Controller
                control={control}
                name="subjects"
                rules={{ required: errorMessages.summary?.required }}
                render={({ field: { ref, value, onChange, ...field } }) => (
                  <TableInput
                    {...field}
                    data={value}
                    onChange={onChange}
                    columns={subjectsColumns}
                    labels={subjectsLabels}
                    sortable={false}
                  />
                )}
              />
            </ContextContainer>
          )}

          {/* Summary container */}
          <ContextContainer title={labels.summary}>
            {/* Summary input */}
            <Controller
              control={control}
              name="summary"
              rules={{ required: errorMessages.summary?.required }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  autosize={true}
                  label={labels.summary}
                  placeholder={placeholders.summary}
                  required={!isEmpty(errorMessages.summary?.required)}
                  error={errors.summary}
                  counter="word"
                  counterLabels={{ single: 'word', plural: 'words' }}
                  showCounter
                />
              )}
            />
          </ContextContainer>
        </ContextContainer>
        <Stack fullWidth justifyContent="end">
          <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
            {labels.buttonNext}
          </Button>
        </Stack>
      </ContextContainer>
    </form>
  );
}

ConfigData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ConfigData };
