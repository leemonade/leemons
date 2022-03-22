import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper, Text } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';
import getInstanceRequest from '../../../request/instance/get';
import updateStudentRequest from '../../../request/instance/updateStudent';

export default function TaskDetail({ id, student }) {
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
        // TRANSLATE: Student not assigned to the task
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
        {/* TRANSLATE: Task detail title */}
        <AdminPageHeader title="Task Detail" />
        <ContextContainer>
          <Text>{task.error}</Text>
        </ContextContainer>
      </PageContainer>
    );
  }

  return (
    <ContextContainer>
      {/* TRANSLATE: Task name */}
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
