import React, { useMemo } from 'react';
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

  const steps = useMemo(() => {
    if (!instance) {
      return [];
    }
    const stepsObj = {
      summary: {
        id: 'statement',
        label: labels.steps.statement,
        component: <StatementStep assignation={assignation} labels={labels} />,
        sidebar: true,
        timestamps: 'open',
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
        };
      },
      submission: () => {
        const { submission } = assignable;
        const onSave = { current: null };

        if (!submission) {
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
          timestamps: 'start',
          showConfirmation: true,
          onSave,
          save: assignation?.started && !assignation?.finished,
          next: assignation?.started && !assignation?.finished,
          // status: 'OK',
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

    return finalSteps;
  }, [assignation]);

  const nextStep = steps[currentStep + 1];
  if (nextStep?.id === 'submission' && !assignation?.started) {
    const shouldDisable = disabledButtons.next !== !assignation?.started;
    if (shouldDisable) {
      disableButton('next', !assignation?.started);
    }
  }

  return steps;
}
