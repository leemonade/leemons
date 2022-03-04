import React, { useMemo } from 'react';
import DeliveryStep from '../Steps/DeliveryStep';
import PreTaskStep from '../Steps/PreTaskStep';
import StatementAndDevelopmentStep from '../Steps/StatementAndDevelopmentStep';
import SummaryStep from '../Steps/SummaryStep';

export default function useGetSteps() {
  // TODO: Calculate steps

  const steps = useMemo(() => [
    {
      label: 'Summary',
      content: <SummaryStep />,
    },
    {
      label: 'Pretask',
      content: <PreTaskStep />,
    },
    {
      label: 'Statement && Development',
      content: <StatementAndDevelopmentStep />,
    },
    {
      label: 'Delivery',
      content: <DeliveryStep />,
    },
    {
      label: 'Self Reflection',
      content: <p>Self Reflection step</p>,
    },
    {
      label: 'Feedback',
      content: <p>Feedback step</p>,
    },
  ]);

  return steps;
}
