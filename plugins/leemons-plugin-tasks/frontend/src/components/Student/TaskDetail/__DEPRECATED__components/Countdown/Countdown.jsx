import React, { useMemo, useEffect } from 'react';
import { ActivityCountdown, createStyles, Box } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

import { useLayout } from '@layout/context';
import FinalizationModal from '../FinalizationModal';

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
    const [durationValue, durationUnits] = instance?.duration?.split(' ') || [];

    if (!startDate.isValid() || !durationValue || !durationUnits) {
      return null;
    }
    const duration = dayjs.duration({ [durationUnits]: durationValue });
    const endDate = startDate.add(duration.asSeconds(), 'seconds');

    if (!endDate.isValid()) {
      return null;
    }

    return endDate;
  }, [assignation]);

export default function Countdown({
  assignation,
  show = true,
  onTimeout,
  localizations,
  updateTimestamps,
}) {
  const { classes } = useStyles();
  const opened = React.useRef(false);
  const toggleModal = React.useRef(null);

  const endDate = useCountdownDate(assignation);

  React.useEffect(() => {
    if (endDate?.isValid() && !opened.current) {
      const timeUntilEnd = endDate?.diff(dayjs(), 'millisecond');

      if (timeUntilEnd <= 0) {
        onTimeout?.();
        toggleModal.current();
        opened.current = true;
      } else {
        const timer = setTimeout(() => {
          onTimeout?.();
          toggleModal.current();
          opened.current = true;
        }, timeUntilEnd);

        return () => clearTimeout(timer);
      }
    }

    return undefined;
  }, [endDate?.format()]);

  if (!endDate || !show) {
    return null;
  }

  const role = assignation?.instance?.assignable?.roleDetails;
  const revisionUrl = role.evaluationDetailUrl
    .replace(':id', assignation?.instance?.id)
    .replace(':user', assignation?.user);

  return (
    <Box className={classes?.root}>
      <FinalizationModal
        actionUrl={revisionUrl}
        assignation={assignation}
        localizations={localizations}
        toggleModal={toggleModal}
        updateTimestamps={updateTimestamps}
      />
      <Box className={classes.countdown}>
        <ActivityCountdown finish={endDate.toDate()} />
      </Box>
    </Box>
  );
}
