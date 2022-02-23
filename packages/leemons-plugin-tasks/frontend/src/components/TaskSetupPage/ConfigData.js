import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty, find } from 'lodash';
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
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const { subscribe, unsubscribe, emitEvent } = useObserver();
  const [centerId, setCenterId] = useState(null);

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

  // ·······························································
  // SUBJECTS

  const subjectsList = useMemo(
    () => [
      {
        label: 'Language',
        value: 'language',
      },
      {
        label: 'Maths',
        value: 'maths',
      },
    ],
    []
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

  const tableData = useMemo(() => []);

  const tableColumns = useMemo(
    () => [
      {
        Header: labels.subject,
        accessor: 'subject',
        input: {
          node: <Select placeholder={placeholders.subject} searchable />,
          rules: { required: 'Required field' },
          data: subjectsList,
        },
        valueRender: (value) => find(subjectsList, { value })?.label,
      },
      {
        Header: labels.level,
        accessor: 'level',
        input: {
          node: <Select placeholder={placeholders.level} searchable />,
          rules: { required: 'Required field' },
          data: levelsList,
        },
        valueRender: (value) => find(levelsList, { value })?.label,
      },
    ],
    [labels]
  );

  const tableLabels = useMemo(
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
              {/* Center Selector */}
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
          <ContextContainer title={labels.subjects}>
            <TableInput
              data={tableData}
              columns={tableColumns}
              labels={tableLabels}
              sortable={false}
              onChange={(e) => console.table(e)}
            />
          </ContextContainer>

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
