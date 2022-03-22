import React, { useMemo } from 'react';
import loadable from '@loadable/component';

const DeliveryStep = loadable(() => import('../Steps/DeliveryStep'));
const PreTaskStep = loadable(() => import('../Steps/PreTaskStep'));
const StatementAndDevelopmentStep = loadable(() => import('../Steps/StatementAndDevelopmentStep'));
const SummaryStep = loadable(() => import('../Steps/SummaryStep'));
const SelfReflectionStep = loadable(() => import('../Steps/SelfReflectionStep'));
const FeedbackStep = loadable(() => import('../Steps/FeedbackStep'));
const CorrectionStep = loadable(() => import('../Steps/CorrectionStep'));

export default function useGetSteps(instance, taskId, student) {
  // TODO: Calculate steps
  // TRANSLATE: Steps labels on Student/TaskDetail and all the steps
  const steps = useMemo(() => [
    {
      label: 'Summary',
      content: <SummaryStep id={taskId} instance={instance} />,
    },
    {
      label: 'Pretask',
      content: <PreTaskStep id={taskId} />,
    },
    {
      label: 'Statement && Development',
      content: <StatementAndDevelopmentStep student={student} instance={instance} id={taskId} />,
    },
    {
      label: 'Delivery',
      content: <DeliveryStep id={taskId} />,
    },
    {
      label: 'Self Reflection',
      content: <SelfReflectionStep id={taskId} />,
    },
    {
      label: 'Feedback',
      content: <FeedbackStep id={taskId} instance={instance} student={student} />,
    },
    {
      label: 'Correction',
      content: <CorrectionStep id={taskId} />,
    },
  ]);

  return steps;
}
