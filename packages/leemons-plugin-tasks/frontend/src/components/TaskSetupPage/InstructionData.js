import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isFunction, uniq } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, Button } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';

import { ChevLeftIcon } from '@bubbles-ui/icons/outline';

function InstructionData({
  labels,
  placeholders,
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
  const [loading, setLoading] = React.useState(null);

  const defaultValues = {
    instructionsForTeachers: '',
    instructionsForStudents: '',
    ...sharedData,
  };

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
  } = useForm({ defaultValues });

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const onSubmit = useCallback(
    (e) => {
      const data = {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'instructionData']),
        },
      };
      setSharedData(data);

      return data;
    },
    [setSharedData, sharedData]
  );
  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit(
          (data) => {
            onSubmit(data);
            emitEvent('saveData');
          },
          () => {
            emitEvent('saveTaskFailed');
          }
        )();
      } else if (event === 'saveTaskFailed') {
        setLoading(false);
      } else if (event === 'saveStep') {
        if (!isDirty) {
          emitEvent('stepSaved');
        } else {
          handleSubmit(
            (data) => {
              onSubmit(data);
              emitEvent('stepSaved');
            },
            () => {
              emitEvent('saveStepFailed');
            }
          )();
        }
      }
    };
    subscribe(f);

    return () => unsubscribe(f);
  }, [isDirty, setSharedData, emitEvent, handleSubmit, subscribe, unsubscribe, setLoading]);

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!isDirty) {
      onPrevious(sharedData);

      return;
    }

    handleSubmit((values) => {
      const data = { ...sharedData, ...values };
      if (isFunction(setSharedData)) setSharedData(data);
      if (isFunction(onPrevious)) onPrevious(data);
    })();
  };

  const handleOnNext = (e) => {
    const data = onSubmit(e);
    if (isFunction(onNext)) onNext(data);
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <form
      onSubmit={(...v) => {
        handleSubmit(handleOnNext)(...v);
      }}
      autoComplete="off"
    >
      <ContextContainer {...props} divided>
        <ContextContainer title={labels.title}>
          <Box>
            <Controller
              control={control}
              name="instructionsForTeachers"
              // rules={{
              //   required: errorMessages.forTeacher?.required,
              // }}
              render={({ field }) => (
                <TextEditorInput
                  {...field}
                  label={labels.forTeacher}
                  placeholder={placeholders.forTeacher}
                  help={helps.forTeacher}
                  error={errors.instructionsForTeachers}
                  // required={!isEmpty(errorMessages.forTeacher?.required)}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="instructionsForStudents"
              // rules={{ required: errorMessages.forStudent?.required }}
              render={({ field }) => (
                <TextEditorInput
                  {...field}
                  label={labels.forStudent}
                  placeholder={placeholders.forStudent}
                  help={helps.forStudent}
                  error={errors.instructionsForStudents}
                  // required={!isEmpty(errorMessages.forStudent?.required)}
                />
              )}
            />
          </Box>
        </ContextContainer>
        <Stack fullWidth justifyContent="space-between">
          <Box>
            <Button
              compact
              variant="light"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={handleOnPrev}
            >
              {labels.buttonPrev}
            </Button>
          </Box>
          <Box>
            <ContextContainer direction="row">
              <Button
                loading={loading === 'onlyPublish'}
                variant="outline"
                onClick={() => {
                  setLoading('onlyPublish');
                  emitEvent('publishTaskAndLibrary');
                }}
              >
                {labels.buttonPublish}
              </Button>
              <Button
                loading={loading === 'publishAndAssign'}
                onClick={() => {
                  setLoading('publishAndAssign');
                  emitEvent('publishTaskAndAssign');
                }}
              >
                {labels.buttonNext}
              </Button>
            </ContextContainer>
          </Box>
        </Stack>
      </ContextContainer>
    </form>
  );
}

InstructionData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
InstructionData.propTypes = {
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
export { InstructionData };
