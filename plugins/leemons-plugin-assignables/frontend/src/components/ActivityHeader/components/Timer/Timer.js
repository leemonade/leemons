import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AlarmClockIcon } from '@bubbles-ui/icons/outline';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { Box, Text } from '@bubbles-ui/components';
import { padStart } from 'lodash';
import useTimerStyles from './Timer.styles';

dayjs.extend(dayjsDuration);

export default function Timer({ instance, hidden }) {
  const duration = useMemo(() => {
    if (!instance?.duration) {
      return null;
    }

    const [time, unit] = instance.duration.split(' ');
    const dur = dayjs.duration(time, unit);

    return {
      hours: Math.floor(dur.asHours()),
      minutes: Math.round(dur.minutes()),
    };
  }, [instance?.duration]);

  const { classes } = useTimerStyles();

  if (!duration || hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <AlarmClockIcon width={18} height={18} />
      </Box>
      <Text className={classes.text}>
        {padStart(duration.hours, 2, '0')}:{padStart(duration.minutes, 2, '0')}
      </Text>
    </Box>
  );
}

Timer.propTypes = {
  instance: PropTypes.shape({
    duration: PropTypes.string,
  }),
  hidden: PropTypes.bool,
};
