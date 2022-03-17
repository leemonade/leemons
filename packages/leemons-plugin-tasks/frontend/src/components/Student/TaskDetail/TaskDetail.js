import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper, Text } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';
import getInstanceRequest from '../../../request/instance/get';
import updateStudentRequest from '../../../request/instance/updateStudent';

export default function TaskDetail({
  id = '1c7e0b22-8dec-4dfa-bab9-4b16304d0515',
  student = '8d5b2118-73e6-4d2b-87be-190d1a43d39a',
}) {
  const [task, setTask] = useState(null);

  useEffect(async () => {
    const instance = await getInstanceRequest(id);

    if (instance) {
      try {
        await updateStudentRequest({
          instance: id,
          student,
          key: 'opened',
          value: new Date().getTime(),
        });
      } catch (e) {
        if (e.message === "Student or instance doesn't exist") {
          setTask({ error: 'Student not assigned to the task' });
          return;
        }
      }

      setTask(instance.task.id);
    }
  }, [id]);

  const steps = useGetSteps(id, task, student);

  if (task?.error) {
    return (
      <PageContainer>
        <AdminPageHeader title="Task Detail" />
        <ContextContainer>
          <Text>{task.error}</Text>
        </ContextContainer>
      </PageContainer>
    );
  }

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
  student: PropTypes.string.isRequired,
};
