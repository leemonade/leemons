import React, { useMemo } from 'react';
import DeliveryStep from '../Steps/DeliveryStep';
import PreTaskStep from '../Steps/PreTaskStep';
import StatementAndDevelopmentStep from '../Steps/StatementAndDevelopmentStep';
import SummaryStep from '../Steps/SummaryStep';

export default function useGetSteps(id) {
  // TODO: Calculate steps

  const steps = useMemo(() => [
    {
      label: 'Summary',
      content: <SummaryStep id={id} />,
    },
    {
      label: 'Pretask',
      content: <PreTaskStep id={id} />,
    },
    {
      label: 'Statement && Development',
      content: <StatementAndDevelopmentStep id={id} />,
    },
    {
      label: 'Delivery',
      content: <DeliveryStep id={id} />,
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
