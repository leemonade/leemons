import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Stack, ContextContainer, TextInput, Button, Textarea } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import SelectProgram from './PickSubject/SelectProgram';
import SelectSubjects from './PickSubject/SelectSubjects';
import TagSelect from './Tags/TagSelect';

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

  const formData = useForm({ defaultValues });
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = formData;

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
    return () => {
      unsubscribe(f);
    };
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = {
      ...sharedData,
      ...e,
    };

    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  // ·······························································
  // SUBJECTS

  const program = watch('program');

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <FormProvider {...formData}>
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

              <SelectProgram
                errorMessages={errorMessages}
                labels={labels}
                placeholders={placeholders}
              />

              <Controller
                control={control}
                name="subjects"
                rules={{ required: errorMessages.subjects?.required }}
                render={({ field }) => (
                  <SelectSubjects
                    {...field}
                    labels={labels}
                    placeholders={placeholders}
                    errors={errors}
                    program={program}
                  />
                )}
              />

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
                      error={errors.summary}
                      counter="word"
                      counterLabels={{ single: 'WORD', plural: 'WORDS' }}
                      showCounter
                    />
                  )}
                />
              </ContextContainer>

              <TagSelect />
            </ContextContainer>
          </ContextContainer>
          <Stack fullWidth justifyContent="end">
            <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
              {labels.buttonNext}
            </Button>
          </Stack>
        </ContextContainer>
      </form>
    </FormProvider>
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
