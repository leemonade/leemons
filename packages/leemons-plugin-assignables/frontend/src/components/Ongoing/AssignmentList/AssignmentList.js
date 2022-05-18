import React, { useEffect, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { PaginatedList } from '@bubbles-ui/components';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';
import useParseAssignations from './hooks/useParseAssignations';
import useAssignationsByProfile from './hooks/useAssignationsByProfile';
import globalContext from '../../../contexts/globalContext';

function useAssignmentsColumns() {
  const { isTeacher } = useContext(globalContext);

  const labels = useMemo(() => {
    if (isTeacher) {
      return {
        task: 'Task',
        group: 'Group',
        start: 'Start date',
        deadline: 'Due date',
        status: 'Status',
        students: 'students',
        open: 'Open',
        ongoing: 'Ongoing',
        completed: 'Completed',
      };
    }

    return {
      task: 'Task',
      subject: 'Subject',
      start: 'Start date',
      deadline: 'Due date',
      status: 'status',
    };
  }, [isTeacher]);

  const columns = useMemo(() => {
    if (isTeacher) {
      return [
        {
          Header: labels.group,
          accessor: 'subject',
        },
        {
          Header: labels.task,
          accessor: 'assignable.asset.name',
        },
        {
          Header: labels.start,
          accessor: 'parsedDates.start',
        },
        {
          Header: labels.deadline,
          accessor: 'parsedDates.deadline',
        },
        {
          Header: labels.students,
          accessor: 'students.length',
        },
        {
          Header: labels.status,
          accessor: 'status',
        },
        {
          Header: labels.open,
          accessor: 'open',
        },
        {
          Header: labels.ongoing,
          accessor: 'ongoing',
        },
        {
          Header: labels.completed,
          accessor: 'completed',
        },
      ];
    }

    return [
      {
        Header: labels.task,
        accessor: 'assignable.asset.name',
      },
      {
        Header: labels.subject,
        accessor: 'subject',
      },
      {
        Header: labels?.start,
        accessor: 'parsedDates.start',
      },
      {
        Header: labels.deadline,
        accessor: 'parsedDates.deadline',
      },
      {
        Header: labels.status,
        accessor: 'status',
      },
    ];
  }, [isTeacher]);

  return columns;
}

export default function AssignmentList() {
  const instances = useSearchAssignableInstances();
  const instancesData = useAssignationsByProfile(instances);
  const parsedInstances = useParseAssignations(instancesData);
  const columns = useAssignmentsColumns();
  // useEffect(() => {
  //   console.log('instancesData', instancesData);
  // }, [instancesData]);

  // useEffect(() => {
  //   console.log('parsedInstances', parsedInstances);
  // }, [parsedInstances]);

  const page = 1;
  const size = 10;

  if (!parsedInstances?.length) {
    return 'Loading...';
  }

  return (
    <>
      <PaginatedList
        columns={columns}
        items={parsedInstances.slice((page - 1) * size, page * size)}
        page={page}
        size={size}
        totalCount={parsedInstances.length}
        totalPages={parsedInstances.length / size}
      />
    </>
  );
}
