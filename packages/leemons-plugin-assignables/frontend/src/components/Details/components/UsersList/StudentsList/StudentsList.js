import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PaginatedList } from '@bubbles-ui/components';

export default function StudentsList({ labels, students }) {
  const columns = useMemo(
    () => [
      {
        Header: labels?.studentListcolumns?.student,
        accessor: 'student',
      },
      {
        Header: labels?.studentListcolumns?.status,
        accessor: 'status',
      },
      {
        Header: labels?.studentListcolumns?.completed,
        accessor: 'completed',
      },
      {
        Header: labels?.studentListcolumns?.avgTime,
        accessor: 'avgTime',
      },
      {
        Header: labels?.studentListcolumns?.score,
        accessor: 'score',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    []
  );

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
    ></PaginatedList>
  );
}

StudentsList.propTypes = {
  students: PropTypes.array,
  labels: PropTypes.shape({
    studentListcolumns: PropTypes.shape({
      student: PropTypes.string,
      status: PropTypes.string,
      completed: PropTypes.string,
      avgTime: PropTypes.string,
      score: PropTypes.string,
    }),
  }),
};
