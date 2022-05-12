import React, { useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  PaginatedList,
  Button,
  Title,
  Select,
  SearchInput,
  Stack,
  ContextContainer,
  Checkbox,
} from '@bubbles-ui/components';
import StudentsList from './StudentsList';

export default function UserList({ labels, placeholders, descriptions }) {
  const students = useMemo(() => {
    const student = {
      student: 'Juan Alberto',
      status: 'En proceso',
      completed: '10',
      avgTime: '10',
      score: '10',
      actions: <Button>Corregir</Button>,
    };

    const array = [];

    for (let i = 0; i < 100; i++) {
      array.push({ ...student, student: `${student.student} (${i})`, id: _.uniqueId() });
    }

    return array;
  }, []);

  const bulkActions = useMemo(
    () => [
      {
        label: 'To be defined',
        value: 'TBD',
      },
      {
        label: labels?.bulkActions?.SEND_REMINDER,
        value: 'SEND_REMINDER',
      },
    ],
    []
  );

  const selected = [];

  return (
    <>
      <ContextContainer spacing={5} sx={(theme) => ({ padding: theme.spacing[5] })}>
        <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <Title order={4}>
            {labels?.students} {students.length}
          </Title>
          <SearchInput placeholder={placeholders?.searchStudent} variant="filled" />
        </Stack>
        <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <Select
            orientation="horizontal"
            description={`${descriptions?.searchStudent} ${selected.length}`}
            data={bulkActions}
            label={labels?.bulkActions?.label}
            placeholder={placeholders?.bulkActions}
          />
          <Button>{labels?.assignStudent}</Button>
        </Stack>
        <StudentsList labels={labels} students={students} />
      </ContextContainer>
    </>
  );
}

UserList.propTypes = {
  labels: PropTypes.shape({
    students: PropTypes.string,
    assignStudent: PropTypes.string,
    studentListcolumns: PropTypes.shape({
      student: PropTypes.string,
      status: PropTypes.string,
      completed: PropTypes.string,
      avgTime: PropTypes.string,
      score: PropTypes.string,
    }),
    bulkActions: PropTypes.shape({
      label: PropTypes.string,
      SEND_REMINDER: PropTypes.string,
    }),
  }),
  placeholders: PropTypes.shape({
    bulkActions: PropTypes.string,
    searchStudent: PropTypes.string,
  }),
  descriptions: PropTypes.shape({
    searchStudent: PropTypes.string,
  }),
};

UserList.defaultProps = {
  labels: {
    students: 'Students',
    assignStudent: 'Assign student',
    bulkActions: {
      label: 'Actions',
      SEND_REMINDER: 'Send reminder',
    },
    studentListcolumns: {
      student: 'Student',
      status: 'Status',
      completed: 'Completed',
      avgTime: 'Avg. time (min)',
      score: 'Score',
    },
  },
  placeholders: {
    bulkActions: 'Select an action',
    searchStudent: 'Search student',
  },
  descriptions: {
    searchStudent: 'selected',
  },
};
