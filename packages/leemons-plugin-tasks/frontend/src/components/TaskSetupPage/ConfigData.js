import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isArray } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Box, Stack, ContextContainer, Button } from '@bubbles-ui/components';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import SelectProgram from './components/PickSubject/SelectProgram';
import SelectSubjects from './components/PickSubject/SelectSubjects';
import PreTaskSelector from './components/PreTaskSelector/PreTaskSelector';

function ConfigData({
  labels,
  placeholders,
  helps,
  errorMessages,
  onNext,
  onPrevious,
  sharedData,
  setSharedData,
  editable,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    subjects: [],
    ...sharedData,
    program:
      sharedData?.program ||
      (isArray(sharedData?.subjects) &&
        sharedData?.subjects.length > 0 &&
        sharedData?.subjects[0].program),
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
      <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
        <ContextContainer {...props} pt={20} divided>
          <ContextContainer>
            <ContextContainer title={labels?.configTitle}>
              <SelectProgram
                errorMessages={errorMessages}
                labels={labels}
                placeholders={placeholders}
                required
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
                    errorMessages={errorMessages}
                    errors={errors}
                    program={program}
                  />
                )}
              />
            </ContextContainer>
          </ContextContainer>
          <Stack fullWidth justifyContent="space-between">
            <Box>
              <Button
                compact
                variant="light"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={onPrevious}
              >
                {labels.buttonPrev}
              </Button>
            </Box>
            <Box>
              <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
                {labels.buttonNext}
              </Button>
            </Box>
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
  onPrevious: PropTypes.func,
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ConfigData };
