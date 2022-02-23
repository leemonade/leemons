import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '@common';
import { getCentersWithToken } from '@users/session';
import { Table } from '@bubbles-ui/components';
import listTeacherTasks from '../../request/instance/listTeacherTasks';

async function getTasks(userAgent, setTasks) {
  const response = await listTeacherTasks(userAgent, true);
  const assignedTasks = response.tasks.items;

  setTasks((t) => [...t, ...assignedTasks]);

  return response;
}

export default function TeacherAssignedTasksLists() {
  const [centers] = useApi(getCentersWithToken);
  const [tasks, setTasks] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Group',
        accessor: 'group',
      },
      {
        Header: 'Task',
        accessor: 'task.name',
      },
      {
        Header: 'Deadline',
        accessor: 'deadline',
      },
      {
        Header: 'Students',
        accessor: 'students.count',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Open',
        accessor: 'students.open',
      },
      {
        Header: 'Ongoing',
        accessor: 'students.ongoing',
      },
      {
        Header: 'Completed',
        accessor: 'students.completed',
      },
      {
        Header: 'Actions',
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
