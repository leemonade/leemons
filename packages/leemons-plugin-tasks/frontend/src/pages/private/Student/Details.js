import React, { useEffect } from 'react';
import { useApi } from '@common';
import { getCentersWithToken } from '@users/session';
import listStudentTasks from '../../../request/instance/listStudentTasks';

async function getTasks(userAgent, setTasks) {
  const response = await listStudentTasks(userAgent, true);
  const assignedTasks = response.tasks.items.map((t) => {
    // eslint-disable-next-line no-param-reassign
    const task = t;
    task.students.count = t.students.count;
    task.group = '-';
    task.students.open = `${t.students.open} | ${Math.round(
      (t.students.open / t.students.count) * 100
    )}%`;
    task.students.ongoing = `${t.students.ongoing} | ${Math.round(
      (t.students.ongoing / t.students.count) * 100
    )}%`;
    task.students.completed = `${t.students.completed} | ${Math.round(
      (t.students.completed / t.students.count) * 100
    )}%`;

    // task.actions = <Actions id={task.id} />;

    return task;
  });

  setTasks((t) => [...t, ...assignedTasks]);

  return response;
}

export default function Details() {
  const [centers] = useApi(getCentersWithToken);

  useEffect(() => {
    if (centers.length) {
      centers.forEach((center) => {
        getTasks(center.userAgentId, console.log);
      });
    }
  }, [centers]);

  return <>Listing user tasks</>;
}
