import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Title, Progress, createStyles } from '@bubbles-ui/components';

const useProgressBarStyles = createStyles((theme) => ({
  bar: {
    background: theme.other.global.background.color.primary.default,
  },
  label: {
    color: theme.other.global.content.color.text.dark,
  },
}));

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    heigth: 250,
    padding: 10,
  },
  title: {
    ...theme.other.global.content.typo.heading['xsm--semiBold'],
  },
  progressBox: {
    width: 284,
  },
}));

const LoadingFormState = ({ description, progress }) => {
  const { classes: progressBarClasses } = useProgressBarStyles();
  const { classes } = useStyles();

  return (
    <Stack direction="column" fullWidth fullHeigth alignItems="center" justifyContent="center">
      <Box noFlex classNames={classes.container}>
        <Stack direction="column" spacing={2} alignItems="center">
          <Title className={classes.title}>{description || ''}</Title>
          <Box className={classes.progressBox}>
            <Progress classNames={progressBarClasses} value={progress} size="xl" radius="xl" />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

LoadingFormState.propTypes = {
  description: PropTypes.string,
  progress: PropTypes.number,
};

export default LoadingFormState;
