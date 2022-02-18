import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import {
  Stack,
  ContextContainer,
  TextInput,
  Button,
  Select,
  Textarea,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

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
    return () => unsubscribe(f);
  }, []);
  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };
    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <form onSubmit={handleSubmit(handleOnNext)}>
      <ContextContainer {...props} divided>
        <ContextContainer title={labels.title}>
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
          {/* Config container */}
          <ContextContainer title="Config" direction="row">
            {/* Program selector */}
            <Controller
              control={control}
              name="program"
              // rules={{ required: errorMessages.program?.required }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={labels.program}
                  placeholder={placeholders.program}
                  error={errors.program}
                  searchable={true}
                  // required={!isEmpty(errorMessages.program?.required)}
                  data={[
                    {
                      label: 'Primary',
                      value: 'primary',
                    },
                    {
                      label: 'Secondary',
                      value: 'secondary',
                    },
                  ]}
                />
              )}
            />
            {/* Course selector */}
            <Controller
              control={control}
              name="course"
              // rules={{ required: errorMessages.course?.required }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={labels.course}
                  placeholder={placeholders.course}
                  error={errors.course}
                  searchable={true}
                  // required={!isEmpty(errorMessages.course?.required)}
                  data={[
                    {
                      label: 'First',
                      value: 'first',
                    },
                    {
                      label: 'Second',
                      value: 'second',
                    },
                  ]}
                />
              )}
            />
          </ContextContainer>

          {/* Subject container */}
          <ContextContainer title="Subject" direction="row" alignItems="end">
            {/* Subject selector */}
            <Controller
              control={control}
              name="subject"
              // rules={{ required: errorMessages.subject?.required }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={labels.subject}
                  placeholder={placeholders.subject}
                  error={errors.subject}
                  searchable={true}
                  // required={!isEmpty(errorMessages.subject?.required)}
                  data={[
                    {
                      label: 'Language',
                      value: 'language',
                    },
                    {
                      label: 'Maths',
                      value: 'maths',
                    },
                  ]}
                />
              )}
            />
            {/* Difficulty selector */}
            <Controller
              control={control}
              name="level"
              // rules={{ required: errorMessages.level?.required }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={labels.level}
                  placeholder={placeholders.level}
                  error={errors.level}
                  searchable={true}
                  // required={!isEmpty(errorMessages.level?.required)}
                  data={[
                    {
                      label: 'Begginer',
                      value: 'begginer',
                    },
                    {
                      label: 'Intermediate',
                      value: 'intermediate',
                    },
                  ]}
                />
              )}
            />
            {/* Add subject button */}
            <Button variant="filled" color="primary" size="xs">
              {labels.addSubject}
            </Button>
          </ContextContainer>

          {/* Summary container */}
          <ContextContainer title="Summary">
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
