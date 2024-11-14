import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { ActivityUnavailable } from '@assignables/components/ActivityUnavailable';
import { useActivityStates } from '@assignables/components/ActivityUnavailable/hooks/useActivityStates';
import { VerticalStepperContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import { useUpdateTimestamps } from '../../__DEPRECATED__components/Steps/Steps';
import DevelopmentStep from '../DevelopmentStep/DevelopmentStep';
import IntroductionStep from '../IntroductionStep/IntroductionStep';
import SubmissionStep from '../SubmissionStep/SubmissionStep';

import { prefixPN } from '@tasks/helpers';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';

function useSteps({ instance, isUnavailable }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.steps'));
  return useMemo(
    () =>
      [
        {
          id: 'introduction',
          label: t('introduction'),
          component: IntroductionStep,
        },
        {
          id: 'development',
          label: t('development'),
          component: DevelopmentStep,
          isBlocked: isUnavailable,
        },
        !!instance?.assignable?.submission && {
          id: 'submission',
          label: t('submission'),
          component: SubmissionStep,
          isBlocked: isUnavailable,
        },
      ].filter(Boolean),
    [t, instance?.assignable?.submission, isUnavailable]
  );
}

export default function StepContainer({ preview, assignation, instance, scrollRef }) {
  const { isUnavailable } = useActivityStates({ instance, user: assignation?.user });

  const steps = useSteps({ instance, isUnavailable });
  const [currentStep, setCurrentStep] = React.useState(0);
  const history = useHistory();

  /*
    === Handle student timestamps ===
  */
  const { mutateAsync } = useStudentAssignationMutation(assignation);
  const updateTimestamp = useUpdateTimestamps(mutateAsync, assignation);
  useEffect(() => {
    if (assignation) {
      updateTimestamp('open');
    }
  }, [updateTimestamp]);

  const onNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await updateTimestamp('end');

        history.push(`/private/tasks/correction/${instance.id}/${assignation?.user}?fromExecution`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepComponent = isUnavailable ? ActivityUnavailable : steps[currentStep].component;

  return (
    <VerticalStepperContainer
      scrollRef={scrollRef}
      data={steps}
      onChangeActiveIndex={setCurrentStep}
      currentStep={currentStep}
    >
      {!!StepComponent && (
        <StepComponent
          scrollRef={scrollRef}
          stepName={steps[currentStep].label}
          preview={preview}
          assignation={assignation}
          user={assignation?.user}
          instance={instance}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
          isLastStep={currentStep >= steps.length - 1}
        />
      )}
    </VerticalStepperContainer>
  );
}

StepContainer.propTypes = {
  preview: PropTypes.bool,
  assignation: PropTypes.object,
  instance: PropTypes.object,
  scrollRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};
