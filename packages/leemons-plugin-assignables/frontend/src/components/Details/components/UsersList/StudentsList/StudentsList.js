import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { PaginatedList } from '@bubbles-ui/components';

export default function StudentsList({ labels, instance, students }) {
  const columns = useMemo(() => {
    const cols = [
      {
        Header: labels?.studentListcolumns?.student || '',
        accessor: 'student',
      },
      {
        Header: labels?.studentListcolumns?.status || '',
        accessor: 'status',
      },
      {
        Header: labels?.studentListcolumns?.completed || '',
        accessor: 'completed',
      },
      {
        Header: labels?.studentListcolumns?.avgTime || '',
        accessor: 'avgTime',
      },
      {
        Header: labels?.studentListcolumns?.score || '',
        accessor: 'score',
      },
      {
        Header: labels?.studentListcolumns?.unreadMessages || '',
        accessor: 'unreadMessages',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ];
    if (!instance?.requiresScoring) {
      cols.splice(4, 1);
    }

    return cols;
  }, [labels, instance?.requiresScoring]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [students]);

  return (
    <PaginatedList
      columns={columns}
      items={students.slice((page - 1) * size, page * size)}
      page={page}
      size={size}
      totalCount={students.length}
      totalPages={students.length / size}
      onPageChange={setPage}
      onSizeChange={setSize}
      selectable
      labels={labels?.pagination}
    ></PaginatedList>
  );
}

StudentsList.propTypes = {
  students: PropTypes.array,
  instance: PropTypes.object,
  labels: PropTypes.shape({
    studentListcolumns: PropTypes.shape({
      student: PropTypes.string,
      status: PropTypes.string,
      completed: PropTypes.string,
      avgTime: PropTypes.string,
      score: PropTypes.string,
      unreadMessages: PropTypes.string,
    }),
    pagination: PropTypes.object,
  }),
};
