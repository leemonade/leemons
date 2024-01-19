import { VerticalStepperContainer } from '@bubbles-ui/components';
import React, { useEffect, useMemo } from 'react';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { useHistory } from 'react-router-dom';
import IntroductionStep from '../IntroductionStep/IntroductionStep';
import DevelopmentStep from '../DevelopmentStep/DevelopmentStep';
import { useUpdateTimestamps } from '../../__DEPRECATED__components/Steps/Steps';
import SubmissionStep from '../SubmissionStep/SubmissionStep';

function useSteps({ instance }) {
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
        },
        !!instance?.assignable?.submission && {
          id: 'submission',
          label: t('submission'),
          component: SubmissionStep,
        },
      ].filter(Boolean),
    [t, instance?.assignable?.submission]
  );
}

export default function StepContainer({ preview, assignation, instance, scrollRef }) {
  const steps = useSteps({ instance });
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
        history.push('/private/assignables/ongoing');
      } catch (e) {}
    }
  };

  const onPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepComponent = steps[currentStep].component;

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
          instance={instance}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
          isLastStep={currentStep >= steps.length - 1}
        />
      )}
    </VerticalStepperContainer>
  );
}
