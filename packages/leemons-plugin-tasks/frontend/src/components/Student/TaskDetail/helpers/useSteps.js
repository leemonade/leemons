import React, { useMemo } from 'react';
import loadable from '@loadable/component';

const DeliveryStep = loadable(() => import('../Steps/DeliveryStep'));
const DevelopmentStep = loadable(() => import('../Steps/DevelopmentStep'));
const StatementStep = loadable(() => import('../Steps/StatementStep'));
const CorrectionStep = loadable(() => import('../Steps/CorrectionStep'));

export default function useSteps(assignation, labels) {
  const instance = assignation?.instance;
  const assignable = instance?.assignable;

  const steps = useMemo(() => {
    if (!instance) {
      return [];
    }
    const stepsObj = {
      summary: {
        label: labels.steps.statement,
        component: <StatementStep assignation={assignation} labels={labels} />,
        sidebar: true,
        timestamps: 'open',
      },
      statement: () => {
        const shouldShowDevelopment = assignable?.development !== null;

        if (!shouldShowDevelopment) {
          return null;
        }
        return {
          label: labels.steps.development,
          component: <DevelopmentStep assignation={assignation} labels={labels} />,
          sidebar: false,
        };
      },
      submission: () => {
        const { submission } = assignable;
        const onNext = { current: null };
        const onPrev = { current: null };

        if (!submission) {
          return null;
        }
        // TODO: Check if submission is filed
        return {
          label: labels.steps.submission,
          component: (
            <DeliveryStep
              assignation={assignation}
              onNext={onNext}
              onPrev={onPrev}
              labels={labels}
            />
          ),
          sidebar: true,
          timestamps: 'start',
          onNext,
          onPrev,
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

  return steps;
}
