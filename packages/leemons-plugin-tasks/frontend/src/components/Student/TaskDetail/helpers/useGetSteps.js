import React, { useMemo } from 'react';
import loadable from '@loadable/component';
import useTask from './useTask';

const DeliveryStep = loadable(() => import('../Steps/DeliveryStep'));
const PreTaskStep = loadable(() => import('../Steps/PreTaskStep'));
const StatementAndDevelopmentStep = loadable(() => import('../Steps/StatementAndDevelopmentStep'));
const SummaryStep = loadable(() => import('../Steps/SummaryStep'));
const SelfReflectionStep = loadable(() => import('../Steps/SelfReflectionStep'));
const FeedbackStep = loadable(() => import('../Steps/FeedbackStep'));
const CorrectionStep = loadable(() => import('../Steps/CorrectionStep'));

export default function useGetSteps(instance, taskId, student) {
  const task = useTask(taskId, ['preTask', 'selfReflection', 'feedback']);
  /*
    Siempre renderizar:
      Summary
      Statement && Development
    Renderizado condicional:
      Pretask solo si existe
      Delivery ???
      Self Reflection si existe
      Feedback si existe
      Correction ????

  */
  // TODO: Calculate steps
  // TRANSLATE: Steps labels on Student/TaskDetail and all the steps
  const steps = useMemo(() => {
    if (!task) {
      return [];
    }

    const stepsObject = {
      summary: {
        label: 'Summary',
        content: <SummaryStep id={taskId} instance={instance} />,
      },
      // EN: Only must be shown when the task has a preTask
      // ES: Solo debe mostrarse cuando la tarea tenga un preTask
      preTask: task?.preTask && {
        label: 'Pretask',
        content: <PreTaskStep id={taskId} />,
      },
      statement: {
        label: 'Statement && Development',
        content: <StatementAndDevelopmentStep student={student} instance={instance} id={taskId} />,
      },
      delivery: {
        label: 'Submission',
        content: <DeliveryStep id={taskId} />,
      },
      // EN: Only must be shown when the task has a selfReflection
      // ES: Solo debe mostrarse cuando la tarea tenga una reflexión personal
      selfReflection: task?.selfReflection && {
        label: 'Self Reflection',
        content: <SelfReflectionStep id={taskId} />,
      },
      // EN: Only must be shown when the task has a feedback
      // ES: Solo debe mostrarse cuando la tarea tenga un feedback
      feedback: task?.feedback && {
        label: 'Feedback',
        content: <FeedbackStep id={taskId} instance={instance} student={student} />,
      },
      // EN: Only must be shown when the correction is visible to the student
      // ES: Solo debe mostrarse cuando la corrección sea visible para el estudiante
      correction: {
        label: 'Correction',
        content: <CorrectionStep id={taskId} />,
      },
    };

    return Object.values(stepsObject).filter((step) => step);
  }, [taskId, instance, student, task]);

  return steps;
}
