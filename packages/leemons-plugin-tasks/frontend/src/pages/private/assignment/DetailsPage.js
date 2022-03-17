import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  PageContainer,
  ContextContainer,
  Select,
  TextInput,
  Table,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { getUserAgentsInfoRequest } from '@users/request';
import { useApi } from '@common';
import listStudents from '../../../request/instance/listStudents';
import getTaskRequest from '../../../request/task/getTask';
import getInstanceRequest from '../../../request/instance/get';

function getStatus({ start, end, opened }) {
  if (end) {
    return 'Completed';
  }

  if (start) {
    return 'Ongoing';
  }

  if (opened) {
    return 'Opened';
  }

  return 'Not Opened';
}

export default function DetailsPage() {
  const { instance } = useParams();

  const [students, setStudents] = useState();

  const [task] = useApi(getInstanceRequest, instance);

  // TRANSLATE: Teacher details columns
  const columns = useMemo(
    () => [
      {
        Header: 'STUDENT',
        accessor: 'student',
      },
      {
        Header: 'STATUS',
        accessor: 'status',
      },
      {
        Header: 'COMPLETED',
        accessor: 'completed',
      },
      {
        Header: 'AV. TIME (MIN)',
        accessor: 'avgTime',
      },
      {
        Header: 'SCORE',
        accessor: 'score',
      },
      {
        Header: 'ACTIONS',
        accessor: 'actions',
      },
    ],
    []
  );

  useEffect(async () => {
    const result = await listStudents(instance);

    if (result) {
      const usersInfo = await getUserAgentsInfoRequest(result.items.map((s) => s.user));

      const users = result.items.map((student) => ({
        student: (
          <UserDisplayItem {...usersInfo?.userAgents?.find((u) => u.id === student.user)?.user} />
        ),
        status: getStatus(student),
        completed: student.end ? new Date(student.end).toLocaleString() : '-',
        avgTime: student.end ? (new Date(student.end) - new Date(student.start)) / 1000 / 60 : '-',
        score: 'NYI',
        actions: 'NYI',
      }));

      setStudents(users);
    }
  }, []);

  return (
    <ContextContainer>
      <AdminPageHeader
        values={{
          title: task?.task?.name,
          description: `Deadline: ${new Date(task?.deadline).toLocaleString()}`,
        }}
      />
      <PageContainer>
        <ContextContainer>
          <ContextContainer direction="row">
            {/* Graphs */}
            <ContextContainer title="STATUS">-</ContextContainer>

            {/* Timeline */}
            <ContextContainer title="TIMELINE">-</ContextContainer>
          </ContextContainer>

          {/* Students */}
          <ContextContainer title={`${students?.length || 0} Students`}>
            <ContextContainer direction="row">
              <Select
                label="BULK ACTION (0 Selected)"
                orientation="horizontal"
                placeholder="SELECT ACTION..."
                data={[{ value: 'Hola', label: 'Holaasa' }]}
              />
              <TextInput placeholder="SEARCH STUDENTS" />
            </ContextContainer>

            {/* List */}
            <Table columns={columns} data={students} />
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
