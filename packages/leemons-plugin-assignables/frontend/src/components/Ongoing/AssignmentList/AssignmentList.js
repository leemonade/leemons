import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PaginatedList } from '@bubbles-ui/components';
import useAssignableInstances from '../../../hooks/assignableInstance/useAssignableInstances';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';
import useParseAssignations from './hooks/useParseAssignations';

export default function AssignmentList() {
  const instances = useSearchAssignableInstances();
  useEffect(() => {
    console.log('instances', instances);
  }, [instances]);
  const instancesData = useAssignableInstances(instances);
  useEffect(() => {
    console.log('instancesData', instancesData);
  }, [instancesData]);
  const parsedInstances = useParseAssignations(instancesData);
  useEffect(() => {
    console.log('parsedInstances', parsedInstances);
  }, [parsedInstances]);

  const labels = useMemo(
    () => ({
      task: 'Task',
      subject: 'Subject',
      start: 'Start date',
      deadline: 'Due date',
      status: 'status',
    }),
    []
  );

  const columns = useMemo(
    () => [
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
    ],
    [labels]
  );

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
