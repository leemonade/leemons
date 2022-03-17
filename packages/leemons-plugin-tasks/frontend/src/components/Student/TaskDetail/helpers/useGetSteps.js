import React, { useMemo } from 'react';
import DeliveryStep from '../Steps/DeliveryStep';
import PreTaskStep from '../Steps/PreTaskStep';
import StatementAndDevelopmentStep from '../Steps/StatementAndDevelopmentStep';
import SummaryStep from '../Steps/SummaryStep';
import SelfReflectionStep from '../Steps/SelfReflectionStep';
import FeedbackStep from '../Steps/FeedbackStep';

export default function useGetSteps(instance, taskId, student) {
  // TODO: Calculate steps

  const steps = useMemo(() => [
    {
      label: 'Summary',
      content: <SummaryStep id={taskId} />,
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
  ]);

  return steps;
}
