import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { noop, uniq } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  ContextContainer,
  Button,
  DropdownButton,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { useObservableContext } from '@common/context/ObservableContext';
import { Attachments } from '@leebrary/components';
import TimeUnitsInput from '@common/components/TimeUnitsInput';

function useDefaultValues() {
  const { getValues } = useObservableContext();

  return useMemo(() => {
    const [instructionsForTeachers, instructionsForStudents, resources, duration] = getValues([
      'sharedData.instructionsForTeachers',
      'sharedData.instructionsForStudents',
      'sharedData.resources',
      'sharedData.duration',
    ]);

    return {
      instructionsForTeachers,
      instructionsForStudents,
      resources,
      duration,
    };
  }, []);
}

function InstructionData({
  labels,
  placeholders,
  helps,
  errorMessages,
  editable,
  onNext = noop,
  onPrevious = noop,
  useObserver,
  loading,
  setLoading = noop,
  stepName,
  scrollRef,
  t,
  showAttachments,
  showInstructions,
  ...props
}) {
  // ·······························································
  // FORM
  const { getValues, setValue } = useObservableContext();
  const defaultValues = useDefaultValues();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    getValues: getLocaleFormValues,
    setValue: setLocaleFormValue,
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

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!isDirty) {
      onPrevious();
      return;
    }

    handleSubmit((values) => {
      onSubmit(values);
      onPrevious();
    })();
  };

  const handleOnNext = () => {
    handleSubmit((values) => {
      onSubmit(values);
      onNext();
    })();
  };

  const handleOnSave = () => {
    handleSubmit((values) => {
      onSubmit(values);
      setLoading('draft');
      emitEvent('saveTask');
    })();
  };

  const handleOnPublish = () => {
    handleSubmit((values) => {
      onSubmit(values);
      setLoading('publish');
      emitEvent('publishTaskAndLibrary');
    })();
  };

  const handleOnAssign = () => {
    handleSubmit((values) => {
      onSubmit(values);
      setLoading('publish');
      emitEvent('publishTaskAndAssign');
    })();
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button
              variant="outline"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={handleOnPrev}
            >
              {labels.buttonPrev}
            </Button>
          }
          rightZone={
            <>
              <Button
                variant="link"
                onClick={handleOnSave}
                disabled={loading}
                loading={loading === 'draft'}
              >
                {t('common.save')}
              </Button>
              <DropdownButton
                chevronUp
                width="auto"
                data={[
                  { label: labels.buttonPublish, onClick: handleOnPublish },
                  { label: labels.buttonPublishAndAssign, onClick: handleOnAssign },
                ]}
                loading={loading === 'publish'}
                disabled={loading}
              >
                {t('common.finish')}
              </DropdownButton>
            </>
          }
        />
      }
    >
      <form
        onSubmit={(...v) => {
          handleSubmit(handleOnNext)(...v);
        }}
        autoComplete="off"
      >
        <Box style={{ marginBottom: 20 }}>
          <ContextContainer {...props}>
            {showAttachments && (
              <ContextContainer title={labels.attachmentsTitle}>
                <Attachments
                  labels={labels}
                  setValue={setLocaleFormValue}
                  getValues={getLocaleFormValues}
                />
              </ContextContainer>
            )}
            {showInstructions && (
              <>
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
                          editorStyles={{ minHeight: '96px' }}
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
                          editorStyles={{ minHeight: '96px' }}
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
                        min={0}
                        max={999}
                      />
                    )}
                  />
                </ContextContainer>
              </>
            )}
          </ContextContainer>
        </Box>
      </form>
    </TotalLayoutStepContainer>
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
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
  loading: PropTypes.any,
  setLoading: PropTypes.func,
  t: PropTypes.func,
  showAttachments: PropTypes.bool,
  showInstructions: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export { InstructionData };
