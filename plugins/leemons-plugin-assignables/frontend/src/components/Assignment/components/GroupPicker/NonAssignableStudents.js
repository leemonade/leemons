import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, Alert, UserDisplayItem, Badge } from '@bubbles-ui/components';
import { useUserAgentsInfo } from '@users/hooks';

export const useNonAssignableStudentsStyles = createStyles((theme) => ({
  studentsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.other.global.spacing.gap.md,
    paddingLeft: theme.other.global.spacing.gap.sm,
    gap: theme.other.global.spacing.gap.md,
  },
}));

export function NonAssignableStudents({ users, error }) {
  const { data: students } = useUserAgentsInfo(users);

  const { classes } = useNonAssignableStudentsStyles();
  return (
    <Alert severity="warning" closeable={false}>
      {error}
      <Box className={classes.studentsContainer}>
        {students?.map((student) => (
          <Badge
            key={student.id}
            label={student.user.name}
            image={student.user.avatar}
            size="xs"
            closable={false}
          />
        ))}
      </Box>
    </Alert>
  );
}

NonAssignableStudents.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
};
