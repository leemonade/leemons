import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';

export default function TaskDetail({ id }) {
  const steps = useGetSteps('f306743c-0d9e-4a26-b2d9-0f8996822ea8@2.0.0');

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

TaskDetail.propTypes = {
  id: PropTypes.string.isRequired,
};
