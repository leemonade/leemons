import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '@common';
import { getCentersWithToken } from '@users/session';
import { Table } from '@bubbles-ui/components';
import listTeacherTasks from '../../request/instance/listTeacherTasks';

async function getTasks(userAgent, setTasks) {
  const response = await listTeacherTasks(userAgent, true);
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

    return task;
  });

  setTasks((t) => [...t, ...assignedTasks]);

  return response;
}

export default function TeacherAssignedTasksLists() {
  const [centers] = useApi(getCentersWithToken);
  const [tasks, setTasks] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'GROUP',
        accessor: 'group',
      },
      {
        Header: 'TASK',
        accessor: 'task.name',
      },
      {
        Header: 'DEADLINE',
        accessor: 'deadline',
      },
      {
        Header: 'STUDENTS',
        accessor: 'students.count',
      },
      {
        Header: 'STATUS',
        accessor: 'status',
      },
      {
        Header: 'OPEN',
        accessor: 'students.open',
      },
      {
        Header: 'ONGOING',
        accessor: 'students.ongoing',
      },
      {
        Header: 'COMPLETED',
        accessor: 'students.completed',
      },
      {
        Header: 'ACTIONS',
        accessor: 'data.actions',
      },
    ],
    []
  );

  useEffect(() => {
    if (centers.length) {
      centers.forEach((center) => {
        getTasks(center.userAgentId, setTasks);
      });
    }
  }, [centers]);

  return <>{tasks.length && <Table columns={columns} data={tasks} />}</>;
}
