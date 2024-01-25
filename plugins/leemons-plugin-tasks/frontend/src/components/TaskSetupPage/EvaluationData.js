import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { noop, set, uniq } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Button,
  DropdownButton,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useObservableContext } from '@common/context/ObservableContext';
import { SubjectSelect } from '@academic-portfolio/components';

import Curriculum from './components/Curriculum';
import Objectives from './components/Objectives';

function useDefaultValues() {
  const { getValues } = useObservableContext();

  return useMemo(
    () => ({
      ...getValues('sharedData'),
    }),
    []
  );
}

function EvaluationData({
  labels,
  placeholders,
  useObserver,
  onNext = noop,
  onPrevious = noop,
  loading,
  setLoading = noop,
  stepName,
  scrollRef,
  showCurriculum,
  showCustomObjectives,
  t,
  isLastStep,
  ...props
}) {
  // ·······························································
  // FORM
  const { getValues, setValue } = useObservableContext();
  const defaultValues = useDefaultValues();

  const [selectedSubject, setSelectedSubject] = useState(defaultValues.subjects?.[0] || null);
  const [objectiveName, setObjectiveName] = useState('');

  const form = useForm({ defaultValues });
  const subjects = form.watch('subjects');

  useEffect(() => {
    setObjectiveName(`curriculum.${selectedSubject}.objectives`);
  }, [selectedSubject]);

  const program = form.watch('program'); // needed when curriculum is enabled again

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  const onSubmit = useCallback(
    (e) => {
      const sharedData = getValues('sharedData');

      const data = {
        ...sharedData,
        ...e,
        metadata: {
          ...sharedData.metadata,
          visitedSteps: uniq([...(sharedData.metadata?.visitedSteps || []), 'evaluationData']),
        },
      };

      setValue('sharedData', data);

      return data;
    },
    [getValues, setValue]
  );

  // ·······························································
  // HANDLERS

  const handleOnPrev = () => {
    if (!form.isDirty) {
      onPrevious();
      return;
    }

    form.handleSubmit((values) => {
      onSubmit(values);
      onPrevious();
    })();
  };

  const handleOnNext = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
      onNext();
    })();
  };

  const handleOnSave = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
      setLoading('draft');
      emitEvent('saveTask');
    })();
  };

  const handleOnPublish = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
      setLoading('publish');
      emitEvent('publishTaskAndLibrary');
    })();
  };

  const handleOnAssign = () => {
    form.handleSubmit((values) => {
      onSubmit(values);
      setLoading('publish');
      emitEvent('publishTaskAndAssign');
    })();
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <form
      onSubmit={(...v) => {
        form.handleSubmit(handleOnNext)(...v);
      }}
      autoComplete="off"
    >
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
                {isLastStep ? (
                  <DropdownButton
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
        {subjects?.length && (
          <ContextContainer {...props}>
            <ContextContainer style={{ width: '212px' }}>
              <SubjectSelect
                labels={{ subject: t('setup.configData.labels.subject') }}
                subjectIds={subjects}
                value={selectedSubject}
                onChange={setSelectedSubject}
                disableAllValues={true}
              />
            </ContextContainer>

            {/* Curriculum - Currently not enabled */}
            {/* {showCurriculum && (
                <ContextContainer title={labels.curriculum}>
                  <Controller
                    control={form.control}
                    name="curriculum.curriculum"
                    render={({ field }) => (
                      <Curriculum
                        {...field}
                        program={program}
                        subjects={subjects}
                        name="curriculum"
                        control={form.control}
                        addLabel={labels.add}
                      />
                    )}
                  />
                </ContextContainer>
              )} */}

            {showCustomObjectives && (
              <ContextContainer title={labels.objectives}>
                <Objectives form={form} name={objectiveName} labels={labels} />
              </ContextContainer>
            )}
          </ContextContainer>
        )}
      </TotalLayoutStepContainer>
    </form>
  );
}

EvaluationData.propTypes = {
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  useObserver: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  showCurriculum: PropTypes.bool,
  showCustomObjectives: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool,
  props: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { EvaluationData };
