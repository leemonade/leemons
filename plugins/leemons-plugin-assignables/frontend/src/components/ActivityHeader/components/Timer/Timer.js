import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AlarmClockIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { Box, Text } from '@bubbles-ui/components';
import { padStart } from 'lodash';
import { useTimerStyles } from './Timer.styles';
import Countdown from './components/Countdown/Countdown';
import millisecondsToTime from './helpers/millisecondsToTime';

dayjs.extend(dayjsDuration);

function useDuration(instance) {
  return useMemo(() => {
    if (!instance?.duration) {
      return null;
    }

    const [time, unit] = instance.duration.split(' ');
    const dur = dayjs.duration(time, unit);

    return {
      duration: dur,
      hours: Math.floor(dur.asHours()),
      minutes: Math.round(dur.minutes()),
    };
  }, [instance?.duration]);
}

export default function Timer({ assignation, instance, hidden, onTimeout, showCountdown }) {
  const startDate = dayjs(assignation?.timestamps?.start ?? null);
  const timeStarted = startDate.isValid();
  const duration = useDuration(instance);

  const { classes, cx } = useTimerStyles();

  if (!duration || hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <AlarmClockIcon width={18} height={18} />
      </Box>
      {timeStarted && showCountdown ? (
        <Countdown
          assignation={assignation}
          instance={instance}
          duration={duration.duration}
          onTimeout={onTimeout}
        />
      ) : (
        <Text className={cx(classes.text, classes.textColor)}>
          {millisecondsToTime(duration.duration)}
        </Text>
      )}
    </Box>
  );
}

Timer.propTypes = {
  assignation: PropTypes.shape({
    timestamps: PropTypes.shape({
      start: PropTypes.string,
    }),
  }),
  instance: PropTypes.shape({
    duration: PropTypes.string,
  }),
  hidden: PropTypes.bool,
  showCountdown: PropTypes.bool,
  onTimeout: PropTypes.func,
};
