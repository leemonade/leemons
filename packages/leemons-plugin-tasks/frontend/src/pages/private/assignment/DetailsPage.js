import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useHistory, useParams } from 'react-router-dom';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  PageContainer,
  ContextContainer,
  Select,
  TextInput,
  UserDisplayItem,
  Button,
  DatePicker,
  Switch,
  PaginatedList,
} from '@bubbles-ui/components';
import { getUserAgentsInfoRequest } from '@users/request';
import { useApi } from '@common';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import listStudents from '../../../request/instance/listStudents';
import getInstanceRequest from '../../../request/instance/get';
import updateInstanceRequest from '../../../request/instance/updateInstance';

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

function ListStudents({ instance }) {
  const history = useHistory();

  const [filters, setFilters] = useState({
    page: 0,
    size: 1,
  });
  const [students, setStudents] = useState();

  const fetchStudents = async () => {
    const result = await listStudents(instance, filters);

    if (result) {
      const usersInfo = await getUserAgentsInfoRequest(result.items.map((s) => s.user));

      setStudents({
        ...result,
        items: result.items.map((student) => ({
          student: (
            <UserDisplayItem {...usersInfo?.userAgents?.find((u) => u.id === student.user)?.user} />
          ),
          status: getStatus(student),
          completed: student.end ? new Date(student.end).toLocaleString() : '-',
          avgTime: student.end
            ? (new Date(student.end) - new Date(student.start)) / 1000 / 60
            : '-',
          score: 'NYI',
          actions: (
            <Button
              variant="link"
              onClick={() => history.push(`/private/tasks/correction/${instance}/${student.user}`)}
            >
              Assess
            </Button>
          ),
        })),
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

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

  /* Students */
  return (
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
      <PaginatedList
        columns={columns}
        items={students?.items}
        page={students?.page}
        size={students?.size}
        totalCount={students?.totalPages}
        onSizeChange={(s) => setFilters((f) => ({ ...f, size: s }))}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />
    </ContextContainer>
  );
}

ListStudents.propTypes = {
  instance: PropTypes.string.isRequired,
};

export default function DetailsPage() {
  const layout = useLayout();
  const { instance } = useParams();

  const [closed, setClosed] = useState();

  const options = useMemo(
    () => ({
      id: instance,
      columns: JSON.stringify(['deadline', 'closeDate']),
    }),
    [instance]
  );

  const [task, , , reFetch] = useApi(getInstanceRequest, options);

  useEffect(() => {
    if (!!task?.closeDate !== closed) {
      setClosed(!!task?.closeDate);
    }
  }, [task]);

  const handleTaskClose = async (v) => {
    setClosed(v);
    if (v) {
      // TRANSLATE: Add copy to this message
      layout?.openDeleteConfirmationModal({
        onConfirm: async () => {
          try {
            await updateInstanceRequest(instance, {
              closeDate: v ? new Date() : null,
            });

            addSuccessAlert('Task closed');

            reFetch();
          } catch (e) {
            addErrorAlert(`Task can't be closed ${e.message}`);
          }
        },
        onCancel: () => {
          setClosed(false);
        },
      })();
    } else {
      try {
        await updateInstanceRequest(instance, {
          closeDate: null,
        });

        addSuccessAlert('Task opened');

        reFetch();
      } catch (e) {
        addErrorAlert(`Task can't be opened ${e.message}`);
      }
    }
  };

  const updateDeadline = async (date) => {
    try {
      task.deadline = date;

      await updateInstanceRequest(instance, {
        deadline: date,
      });

      addSuccessAlert('Deadline updated');

      reFetch();
    } catch (e) {
      addErrorAlert(`Task deadline can't be updated: ${e.message}`);
    }
  };

  return (
    <ContextContainer>
      <AdminPageHeader
        values={{
          title: task?.task?.name,
          // description: `Deadline: ${new Date(task?.deadline).toLocaleString()}`,
        }}
      />
      <PageContainer>
        <DatePicker
          withTime
          label="Deadline"
          value={new Date(task?.deadline)}
          onChange={updateDeadline}
        />
        <Button onClick={() => updateDeadline(dayjs(task?.deadline).add(1, 'day').toDate())}>
          +1D
        </Button>
        <Button onClick={() => updateDeadline(dayjs(task?.deadline).add(7, 'day').toDate())}>
          +7D
        </Button>

        <Switch onChange={handleTaskClose} checked={closed} label="Close task" />
        <ContextContainer>
          <ContextContainer direction="row">
            {/* Graphs */}
            <ContextContainer title="STATUS">-</ContextContainer>

            {/* Timeline */}
            <ContextContainer title="TIMELINE">-</ContextContainer>
          </ContextContainer>

          <ListStudents instance={instance} />
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
