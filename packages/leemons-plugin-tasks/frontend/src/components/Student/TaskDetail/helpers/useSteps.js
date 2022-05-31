import React, { useMemo, useEffect } from 'react';
import { map } from 'lodash';
import loadable from '@loadable/component';

const DeliveryStep = loadable(() => import('../Steps/DeliveryStep'));
const DevelopmentStep = loadable(() => import('../Steps/DevelopmentStep'));
const StatementStep = loadable(() => import('../Steps/StatementStep'));

export default function useSteps({
  assignation,
  labels,
  disableButton,
  disabledButtons,
  currentStep,
}) {
  const instance = assignation?.instance;
  const assignable = instance?.assignable;
  const shouldShowDevelopment = assignable?.development !== null;
  const shouldShowSubmission = assignable?.submission !== null;

  const steps = useMemo(() => {
    if (!instance) {
      return { steps: [] };
    }
    const stepsObj = {
      summary: {
        id: 'statement',
        label: labels.steps.statement,
        component: <StatementStep assignation={assignation} labels={labels} />,
        sidebar: true,
        timestamps: 'open',
        limitedTimeAlert: !shouldShowDevelopment,
        status: 'OK',
      },
      statement: () => {
        if (!shouldShowDevelopment) {
          return null;
        }

        return {
          id: 'development',
          label: labels.steps.development,
          component: <DevelopmentStep assignation={assignation} labels={labels} />,
          sidebar: true,
          countdown: true,
          limitedTimeAlert: true,
          status: 'OK',
        };
      },
      submission: () => {
        const { submission } = assignable;
        const onSave = { current: null };

        if (!shouldShowSubmission) {
          return null;
        }

        // TODO: Check if submission is filed
        return {
          id: 'submission',
          label: labels.steps.submission,
          component: (
            <DeliveryStep
              assignation={assignation}
              onSave={onSave}
              labels={labels}
              disableButton={disableButton}
            />
          ),
          sidebar: true,
          countdown: true,
          timestamps: 'start',
          showConfirmation: true,
          onSave,
          onChangeActiveIndex: onSave,
          save: assignation?.started && !assignation?.finished,
          next: assignation?.started && !assignation?.finished,
          status: 'OK',
          // badge: 'Submitted',
        };
      },
    };

    const stepsToShow = ['summary', 'statement', 'submission'];

    const finalSteps = stepsToShow
      .map((step) => {
        if (typeof stepsObj[step] === 'function') {
          return stepsObj[step]();
        }

        return stepsObj[step];
      })
      .filter((step) => step);

    const visitedSteps = assignation?.metadata?.visitedSteps?.map((step) =>
      finalSteps.findIndex(({ id }) => id === step)
    );

    return { steps: finalSteps, visitedSteps };
  }, [assignation]);

  useEffect(() => {
    if (!steps?.steps?.length) {
      return;
    }

    if (
      !assignation.started &&
      steps?.steps?.[currentStep]?.id === 'statement' &&
      !disabledButtons.next
    ) {
      disableButton('next', true);
    }
  }, [assignation, currentStep, disabledButtons, steps?.steps]);

  return steps;
}
