import React, { useMemo } from 'react';
import loadable from '@loadable/component';
// import useTask from './useTask';
// import useCorrection from '../../../Grade/hooks/useCorrection';

const DeliveryStep = loadable(() => import('../Steps/DeliveryStep'));
const PreTaskStep = loadable(() => import('../Steps/PreTaskStep'));
const StatementAndDevelopmentStep = loadable(() => import('../Steps/StatementAndDevelopmentStep'));
const SummaryStep = loadable(() => import('../Steps/SummaryStep'));
const SelfReflectionStep = loadable(() => import('../Steps/SelfReflectionStep'));
const FeedbackStep = loadable(() => import('../Steps/FeedbackStep'));
const CorrectionStep = loadable(() => import('../Steps/CorrectionStep'));

export default function useSteps(assignation) {
  const instance = assignation?.instance;
  const task = instance?.assignable;

  const steps = useMemo(
    () => [
      {
        label: 'Summary',
        component: <SummaryStep assignation={assignation} />,
        sidebar: true,
        timestamps: 'open',
      },
      {
        label: 'Example',
      },
    ],
    [assignation]
  );

  return steps;
}
