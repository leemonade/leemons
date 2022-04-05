import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '@common';
import { getCentersWithToken } from '@users/session';
import listStudentTasks from '../../../request/instance/listStudentTasks';
import TaskDetail from '../../../components/Student/TaskDetail/TaskDetail';

async function getTasks(userAgent, setTasks) {
  const response = await listStudentTasks(userAgent, true);
  const assignedTasks = response.tasks.items.map((t) => {
    const task = t;

    return task;
  });

  setTasks((t) => [...t, ...assignedTasks]);

  return response;
}

export default function Details() {
  const { id } = useParams();
  const [centers] = useApi(getCentersWithToken);

  if (centers.length) {
    return <TaskDetail id={id} student={centers[0].userAgentId} />;
  }

  return null;
}
