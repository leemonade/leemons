import React from 'react';
import PropTypes from 'prop-types';
import { Title, SearchInput, Stack, ContextContainer } from '@bubbles-ui/components';

import StudentsList from './StudentsList';

import useParsedStudents from './helpers/useParseStudents';

export default function UserList({ labels, placeholders, descriptions, instance }) {
  const students = useParsedStudents(instance);

  // const bulkActions = useMemo(
  //   () => [
  //     {
  //       label: 'To be defined',
  //       value: 'TBD',
  //     },
  //     {
  //       label: labels?.bulkActions?.SEND_REMINDER,
  //       value: 'SEND_REMINDER',
  //     },
  //   ],
  //   []
  // );

  // const selected = [];

  return (
    <>
      <ContextContainer spacing={5} sx={(theme) => ({ padding: theme.spacing[5] })}>
        <Stack fullWidth>
          <Title order={4}>
            {labels?.students} {students.length}
          </Title>
          <SearchInput placeholder={placeholders?.searchStudent} variant="filled" />
        </Stack>
        {/* <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <Select
            orientation="horizontal"
            description={`${descriptions?.searchStudent} ${selected.length}`}
            data={bulkActions}
            label={labels?.bulkActions?.label}
            placeholder={placeholders?.bulkActions}
          />
          <Button>{labels?.assignStudent}</Button>
        </Stack> */}
        <StudentsList labels={labels} students={students} />
      </ContextContainer>
    </>
  );
}

UserList.propTypes = {
  instance: PropTypes.object,
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
