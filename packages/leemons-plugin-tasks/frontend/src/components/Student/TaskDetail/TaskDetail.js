import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, PageContainer, Stepper, Text, Loader } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useGetSteps from './helpers/useGetSteps';
import updateStudentRequest from '../../../request/instance/updateStudent';
import useInstance from './helpers/useInstance';
import useTask from './helpers/useTask';

export default function TaskDetail({ id, student }) {
  const instance = useInstance(id);
  const task = useTask(instance?.task?.id, ['name']);

  useEffect(async () => {
    if (instance) {
      await updateStudentRequest({
        instance: id,
        student,
        key: 'opened',
        value: new Date().getTime(),
      });
    }
  }, [instance, student]);

  const steps = useGetSteps(id, task?.id, student);

  if (!task) {
    return <Loader />;
  }

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
      <AdminPageHeader values={{ title: task?.name }} />
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
