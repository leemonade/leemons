import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isFunction, uniq } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, Stack, ContextContainer, Button } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { useObservableContext } from '@common/context/ObservableContext';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';

function useDefaultValues() {
  const { getValues } = useObservableContext();

  return useMemo(() => {
    const [instructionsForTeachers, instructionsForStudents] = getValues([
      'sharedData.instructionsForTeachers',
      'sharedData.instructionsForStudents',
    ]);

    return {
      instructionsForTeachers,
      instructionsForStudents,
    };
  }, []);
}

function InstructionData({
  labels,
  placeholders,
  helps,
  errorMessages,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM
  const { getValues, setValue } = useObservableContext();
  const [loading, setLoading] = React.useState(null);

  const defaultValues = useDefaultValues();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues });

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const onSubmit = useCallback(
    (e) => {
      const sharedData = getValues('sharedData');

      const data = {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'instructionData']),
        },
      };

      setValue('sharedData', data);

      return data;
    },
    [getValues, setValue]
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
  }, [isDirty, onSubmit, emitEvent, handleSubmit, subscribe, unsubscribe, setLoading]);

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!isDirty) {
      onPrevious();

      return;
    }

    handleSubmit((values) => {
      onSubmit(values);
      if (isFunction(onPrevious)) onPrevious();
    })();
  };

  const handleOnNext = (e) => {
    onSubmit(e);
    if (isFunction(onNext)) onNext();
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
              render={({ field }) => (
                <TextEditorInput
                  {...field}
                  label={labels.forTeacher}
                  placeholder={placeholders.forTeacher}
                  help={helps.forTeacher}
                  error={errors.instructionsForTeachers}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="instructionsForStudents"
              render={({ field }) => (
                <TextEditorInput
                  {...field}
                  label={labels.forStudent}
                  placeholder={placeholders.forStudent}
                  help={helps.forStudent}
                  error={errors.instructionsForStudents}
                />
              )}
            />
          </Box>
        </ContextContainer>
        <ContextContainer>
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <TimeUnitsInput
                {...field}
                label={labels.recommendedDuration}
                error={errors.recommendedDuration}
              />
            )}
          />
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
