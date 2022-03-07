import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';

export default function TaskDetail({ id }) {
  const steps = useGetSteps(id);

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
