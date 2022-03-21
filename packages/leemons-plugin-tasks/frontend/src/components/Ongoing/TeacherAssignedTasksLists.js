import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useApi, unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import {
  Table,
  ContextContainer,
  Button,
  Text,
  SearchInput,
  useDebouncedValue,
} from '@bubbles-ui/components';
import { ViewOnIcon, StudyDeskIcon } from '@bubbles-ui/icons/outline';
import { prefixPN } from '../../helpers/prefixPN';
import listTeacherTasks from '../../request/instance/listTeacherTasks';
import Filters from './Filters';

function Actions({ id }) {
  const history = useHistory();
  return (
    <ContextContainer alignItems="center" direction="row">
      <StudyDeskIcon
        as="button"
        color="secondary"
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(`/private/tasks/student-detail/${id}`)}
      />
      <ViewOnIcon
        as="button"
        color="secondary"
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(`/private/tasks/details/${id}`)}
      />
    </ContextContainer>
  );
}

async function getTasks(userAgent, filters, setTasks) {
  const response = await listTeacherTasks(userAgent, { ...filters, details: true });

  const assignedTasks = response?.data?.items?.map((t) => {
    const task = t;
    task.students.count = t.students.count;
    task.group = '-';
    task.students.open = `${t.students.open} | ${
      t.students.count ? Math.round((t.students.open / t.students.count) * 100) : 0
    }%`;
    task.students.ongoing = `${t.students.ongoing} | ${
      t.students.count ? Math.round((t.students.ongoing / t.students.count) * 100) : 0
    }%`;
    task.students.completed = `${t.students.completed} | ${
      t.students.count ? Math.round((t.students.completed / t.students.count) * 100) : 0
    }%`;

    task.deadline = t.alwaysOpen ? '-' : new Date(t.deadline).toLocaleString();

    task.actions = <Actions id={task.id} />;

    return task;
  });

  setTasks((t) => [...t, ...assignedTasks]);

  return response;
}

export default function TeacherAssignedTasksLists({ showClosed }) {
  const [, translations] = useTranslateLoader(prefixPN('teacher_assignments'));
  const [tableLabels, setTableLabels] = useState({});
  const [centers] = useApi(getCentersWithToken);
  const [name, setName] = useState('');
  const [debouncedName] = useDebouncedValue(name, 500);
  const [filters, setFilters] = useState({});
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setTasks([]);
    setFilters((f) => ({
      ...f,
      name: debouncedName,
    }));
  }, [debouncedName]);

  // EN: Parse the translations object
  // ES: Procesar el objeto de traducciones
  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res?.plugins?.tasks?.teacher_assignments;

      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
      setTableLabels(data.table.headers);
    }
  }, [translations]);

  const columns = useMemo(
    () => [
      {
        Header: tableLabels?.group,
        accessor: 'group',
      },
      {
        Header: tableLabels?.task,
        accessor: 'task.name',
      },
      {
        Header: tableLabels?.deadline,
        accessor: 'deadline',
      },
      {
        Header: tableLabels?.students,
        accessor: 'students.count',
      },
      {
        Header: tableLabels?.status,
        accessor: 'status',
      },
      {
        Header: tableLabels?.open,
        accessor: 'students.open',
      },
      {
        Header: tableLabels?.ongoing,
        accessor: 'students.ongoing',
      },
      {
        Header: tableLabels?.completed,
        accessor: 'students.completed',
      },
      {
        Header: tableLabels?.actions,
        accessor: 'actions',
      },
    ],
    [tableLabels]
  );

  useEffect(() => {
    if (centers.length) {
      centers.forEach((center) => {
        getTasks(center.userAgentId, { showClosed, hideOpened: showClosed, ...filters }, setTasks);
      });
    }
  }, [centers, filters]);

  return (
    <>
      <Filters
        onChange={(f) => {
          setTasks([]);
          setFilters(f);
        }}
      />
      <SearchInput value={name} onChange={setName} />
      {tasks?.length === 0 && (
        <ContextContainer direction="row" justifyContent="start" alignItems="center">
          <Text>You don&apos;t have ongoing tasks with the applied filters. Assign a new one</Text>
          <Button noFlex onClick={() => history.push('/private/tasks/library')}>
            Go to Library
          </Button>
        </ContextContainer>
      )}
      {tasks?.length > 0 && <Table columns={columns} data={tasks} />}
    </>
  );
}
