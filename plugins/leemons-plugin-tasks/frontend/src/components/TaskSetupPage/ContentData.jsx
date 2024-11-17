// Libraries
import {
  Box,
  Button,
  ContextContainer,
  Switch,
  DropdownButton,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { noop, uniq } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useObservableContext } from '@common/context/ObservableContext';

import Submissions from './components/Submissions';
import StatementImage from './components/StatementImage';
import Development from './components/Development';

function useDefaultValues() {
  const { getValues } = useObservableContext();
  const hasDevelopment = getValues('sharedData.metadata.development')?.length > 0;

  return useMemo(() => {
    const sharedData = { ...getValues('sharedData') };
    sharedData.metadata = { ...sharedData.metadata, hasDevelopment };
    return {
      gradable: false,
      ...sharedData,
    };
  }, []);
}

function ContentData({
  labels,
  placeholders,
  descriptions,
  helps,
  errorMessages,
  editable,
  onNext = noop,
  onPrevious = noop,
  useObserver,
  stepName,
  scrollRef,
  loading,
  setLoading,
  t,
  config,
  ...props
}) {
  const { useWatch, getValues, setValue } = useObservableContext();
  const isExpress = !!useWatch({ name: 'isExpress' });
  const [isLastStep, setIsLastStep] = React.useState(isExpress);

  // ·······························································
  // FORM

  const defaultValues = useDefaultValues();
  const formData = useForm({ defaultValues });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = formData;

  // MANAGE OPTIONAL FIELDS -------------------------------------------------
  const hasDevelopment = watch('metadata.hasDevelopment');
  const hasInstructions = watch('metadata.hasInstructions');
  const hasAttachments = watch('metadata.hasAttachments');
  const hasCurriculum = watch('metadata.hasCurriculum');
  const hasCustomObjectives = watch('metadata.hasCustomObjectives');
  const hasSubjects = !!watch('subjects')?.length;

  function amITheLastStep() {
    return !!(!hasInstructions && !hasAttachments && !hasCurriculum && !hasCustomObjectives);
  }

  useEffect(() => {
    config?.setValue('hasInstructions', hasInstructions);
    setIsLastStep(amITheLastStep());
  }, [hasInstructions]);
  useEffect(() => {
    config?.setValue('hasAttachments', hasAttachments);
    setIsLastStep(amITheLastStep());
  }, [hasAttachments]);
  useEffect(() => {
    config?.setValue('hasCurriculum', hasCurriculum);
    setIsLastStep(amITheLastStep());
  }, [hasCurriculum]);
  useEffect(() => {
    config?.setValue('hasCustomObjectives', hasCustomObjectives);
    setIsLastStep(amITheLastStep());
  }, [hasCustomObjectives]);

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const onSubmit = useCallback(
    (e) => {
      const sharedData = getValues('sharedData');

      setValue('sharedData', {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          ...e.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'contentData']),
        },
      });
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
        setLoading(null);
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
  }, [isDirty, onSubmit, emitEvent, handleSubmit, subscribe, unsubscribe]);

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
              {isExpress || isLastStep ? (
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
              ) : (
                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={handleOnNext}
                  disabled={loading}
                  loading={loading === 'publish'}
                >
                  {labels.buttonNext}
                </Button>
              )}
            </>
          }
        />
      }
    >
      <FormProvider {...formData}>
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <ContextContainer {...props}>
            <ContextContainer style={{ marginBottom: 20 }}>
              <ContextContainer title={labels?.statement}>
                <StatementImage labels={labels} />
                <Controller
                  control={control}
                  name="statement"
                  render={({ field }) => (
                    <TextEditorInput
                      {...field}
                      label={labels?.statementLabel}
                      error={errors.statement}
                      editorStyles={{ minHeight: '96px' }}
                    />
                  )}
                />

                {!isExpress && (
                  <Controller
                    control={control}
                    name="metadata.hasDevelopment"
                    render={({ field }) => (
                      <Switch {...field} label={labels.development} checked={field.value} />
                    )}
                  />
                )}
                {!isExpress && hasDevelopment && (
                  <Development
                    label={labels.development}
                    placeholder={placeholders.development}
                    name="metadata.development"
                  />
                )}
              </ContextContainer>

              <ContextContainer title={labels?.submission?.title}>
                <Submissions labels={labels} errorMessages={errorMessages} />
              </ContextContainer>

              {!isExpress && hasSubjects && (
                <ContextContainer title={labels.evaluation} spacing={0}>
                  <Controller
                    control={control}
                    name="metadata.hasCurriculum"
                    disabled
                    render={({ field }) => (
                      <Switch {...field} label={labels.enableCurriculum} checked={field.value} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="metadata.hasCustomObjectives"
                    render={({ field }) => (
                      <Switch {...field} label={labels.addCustomObjectives} checked={field.value} />
                    )}
                  />
                </ContextContainer>
              )}

              {!isExpress && (
                <ContextContainer title={labels.other} spacing={0}>
                  <Controller
                    control={control}
                    name="metadata.hasAttachments"
                    render={({ field }) => (
                      <Switch {...field} label={labels.addResources} checked={field.value} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="metadata.hasInstructions"
                    render={({ field }) => (
                      <Switch {...field} label={labels.addInstructions} checked={field.value} />
                    )}
                  />
                </ContextContainer>
              )}
            </ContextContainer>
          </ContextContainer>
        </form>
      </FormProvider>
    </TotalLayoutStepContainer>
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
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  useObserver: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
  loading: PropTypes.any,
  setLoading: PropTypes.func,
  t: PropTypes.func,
  config: PropTypes.shape({
    setValue: PropTypes.func,
  }),
};

// eslint-disable-next-line import/prefer-default-export
export { ContentData };
