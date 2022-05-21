import React, { useState, useMemo, useContext } from 'react';
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
      status: 'Status',
      timeReference: 'Time reference',
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
        {
          Header: '',
          accessor: 'actions',
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
      {
        Header: labels.timeReference,
        accessor: 'timeReference',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ];
  }, [isTeacher]);

  return columns;
}

export default function AssignmentList({ closed = false }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const query = useMemo(() => {
    const q = {};

    if (closed) {
      q.close_max = new Date();
      q.close = new Date();
      q.close_default = false;
    } else {
      q.close_min = new Date();
      q.close_default = true;
    }

    return q;
  }, []);

  const [instances, instancesLoading] = useSearchAssignableInstances(query);

  const instancesInPage = useMemo(() => {
    if (!instances.length) {
      return [];
    }

    return instances.slice((page - 1) * size, page * size);
  }, [instances, page, size]);

  const [instancesData, instancesDataLoading] = useAssignationsByProfile(instancesInPage);
  const [parsedInstances, parsedInstancesLoading] = useParseAssignations(instancesData);
  const columns = useAssignmentsColumns();

  const isLoading = instancesLoading || instancesDataLoading || parsedInstancesLoading;

  return (
    <>
      <PaginatedList
        columns={columns}
        items={parsedInstances}
        page={page}
        size={size}
        loading={isLoading}
        totalCount={instances.length}
        totalPages={Math.ceil(instances.length / size)}
        onSizeChange={setSize}
        onPageChange={setPage}
      />
    </>
  );
}

AssignmentList.propTypes = {
  closed: PropTypes.bool,
};
