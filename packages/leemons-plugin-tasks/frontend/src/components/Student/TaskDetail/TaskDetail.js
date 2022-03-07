import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';
import getInstanceRequest from '../../../request/instance/get';
import updateStudentRequest from '../../../request/instance/updateStudent';

export default function TaskDetail({ id = 'beab7544-090b-4add-8111-ac628b20e2e3' }) {
  const [task, setTask] = useState(null);

  useEffect(async () => {
    const instance = await getInstanceRequest(id);

    updateStudentRequest({
      instance: id,
      student: '656fe721-253d-40ff-9eb1-2232ffd2a10b',
      key: 'opened',
      value: new Date().getTime(),
    });

    setTask(instance.task.id);
  }, [id]);

  const steps = useGetSteps(task);

  return (
    <ContextContainer>
      <AdminPageHeader title="FUTURE HEADER - TASK NAME" />
      <PageContainer>
        <Stepper data={steps} />
      </PageContainer>
    </ContextContainer>
  );
}

TaskDetail.propTypes = {
  id: PropTypes.string.isRequired,
};
