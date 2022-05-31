import React, { useMemo } from 'react';
import { ActivityCountdown, createStyles, Box } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing[6],
    marginRight: theme.spacing[5],
  },
  countdown: {
    backgroundColor: theme.colors.uiBackground02,
    width: 210,
    height: 60,
    borderRadius: theme.spacing[2],
  },
}));

dayjs.extend(dayjsDuration);

const useCountdownDate = (assignation) =>
  useMemo(() => {
    const instance = assignation?.instance;
    const startDate = dayjs(assignation?.timestamps?.start || null);
    // const deadline = dayjs(instance?.dates?.deadline || null);
    const [durationValue, durationUnits] = instance?.duration?.split(' ') || [];

    if (!startDate.isValid() || !durationValue || !durationUnits) {
      return null;
    }
    const duration = dayjs.duration({ [durationUnits]: durationValue });
    const endDate = startDate.add(duration.asSeconds(), 'seconds');

    // if (deadline.isValid() && deadline.isBefore(endDate)) {
    //   endDate = deadline;
    // }

    if (!endDate.isValid()) {
      return null;
    }

    return endDate;
  }, [assignation]);

export default function Countdown({ assignation, show = true }) {
  const { classes } = useStyles();

  const endDate = useCountdownDate(assignation);

  if (!endDate || !show) {
    return null;
  }

  return (
    <Box className={classes?.root}>
      <Box className={classes.countdown}>
        <ActivityCountdown finish={endDate.toDate()} />
      </Box>
    </Box>
  );
}
