import React from 'react';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';

export default function TaskDetail() {
  const steps = useGetSteps();

  return (
    <ContextContainer>
      <AdminPageHeader title="FUTURE HEADER - TASK NAME" />
      <PageContainer>
        <p>Hola Mundo</p>
        <Stepper data={steps} />
      </PageContainer>
    </ContextContainer>
  );
}
