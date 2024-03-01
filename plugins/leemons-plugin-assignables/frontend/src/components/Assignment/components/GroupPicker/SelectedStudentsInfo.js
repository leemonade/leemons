import { Alert, Box, Text, createStyles } from '@bubbles-ui/components';
import { flatMap, uniq } from 'lodash';
import React from 'react';
import { useWatch } from 'react-hook-form';
import propTypes from 'prop-types';

const useSelectedStudentsInfoStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
    },
    options: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
    },
  };
});

export default function SelectedStudentsInfo({ control, value, availableClasses, localizations }) {
  const selectedClasses = availableClasses.filter(({ id }) => value?.raw?.classes?.includes(id));

  const selected = uniq(flatMap(value?.value, 'students')).length;
  const nonAssignableStudentsCount = uniq(
    flatMap(selectedClasses, 'nonAssignableStudents')
  )?.length;

  const excluded = useWatch({ control, name: 'excluded' });
  const excludedStudentsCount = excluded?.length ?? 0;

  const { classes } = useSelectedStudentsInfoStyles();

  return (
    <Alert closeable={false}>
      <Box className={classes.root}>
        <Box>
          <Text color="primary" strong>
            {localizations?.total}
          </Text>
        </Box>
        <Box className={classes.options}>
          <Text color="primary">
            {selected} {localizations?.selectedStudents}
          </Text>
          <Text color="primary">
            {nonAssignableStudentsCount} {localizations?.nonMatchingStudents}
          </Text>
          <Text color="primary">
            {excludedStudentsCount} {localizations?.excluded}
          </Text>
        </Box>
      </Box>
    </Alert>
  );
}

SelectedStudentsInfo.propTypes = {
  control: propTypes.any,
  value: propTypes.any,
  availableClasses: propTypes.array,
  localizations: propTypes.any,
};
