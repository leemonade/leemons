import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Box, Stack, ContextContainer, Select, Button } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';
import Objectives from './components/Objectives';
import SelfReflection from './components/SelfReflection';
import Submissions from './components/Submissions';
import Contents from './components/Contents';
import AssessmentCriteria from './components/AssessmentCriteria';
import Attachments from './components/Attachments';
import Methodology from './components/Methodology';

function ContentData({
  labels,
  placeholders,
  descriptions,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    methodology: '',
    ...sharedData,
  };

  const formData = useForm({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formData;

  const { subscribe, unsubscribe, emitEvent } = useObserver();

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
    <FormProvider {...formData}>
      <form onSubmit={handleSubmit(handleOnNext)}>
        <ContextContainer {...props} divided>
          <ContextContainer title={labels.title}>
            <Methodology
              labels={labels}
              errorMessages={errorMessages}
              placeholders={placeholders}
            />
            <Attachments />
            <Controller
              control={control}
              name="recommendedDuration"
              render={({ field }) => (
                <TimeUnitsInput
                  {...field}
                  label={labels.recommendedDuration}
                  error={errors.recommendedDuration}
                  min={0}
                />
              )}
            />
            <Contents required label={labels.content} error={errors.content} />
            <Objectives required label={labels.objectives} error={errors.objectives} />
            <AssessmentCriteria
              label={labels.assessmentCriteria}
              error={errors.assessmentCriteria}
            />
            {/* TODO: Make the statement required (Not allowed with TextEditor) */}
            <Controller
              control={control}
              name="statement"
              rules={{
                required: errorMessages.statement?.required,
              }}
              render={({ field }) => (
                <TextEditor required {...field} label={labels.statement} error={errors.statement} />
              )}
            />
            <Controller
              control={control}
              name="development"
              rules={{ required: errorMessages.development?.required }}
              render={({ field }) => (
                <TextEditor
                  {...field}
                  label={labels.development}
                  placeholder={placeholders.development}
                  error={errors.development}
                  required={!isEmpty(errorMessages.development?.required)}
                />
              )}
            />
            <Submissions labels={labels} />
            <SelfReflection
              labels={labels?.selfReflection}
              description={descriptions?.selfReflection}
              name="selfReflection"
            />
            <SelfReflection
              labels={labels?.feedback}
              description={descriptions?.feedback}
              name="feedback"
            />
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

ContentData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
ContentData.propTypes = {
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
export { ContentData };
