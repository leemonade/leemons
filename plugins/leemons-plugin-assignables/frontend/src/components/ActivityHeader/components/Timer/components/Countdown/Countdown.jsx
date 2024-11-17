import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { Text } from '@bubbles-ui/components';

import useCountdown from 'react-countdown-hook';
import dayjs from 'dayjs';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import { useTimerStyles } from '../../Timer.styles';
import { millisecondsToTime } from '../../helpers/millisecondsToTime';

const useCountdownRemainingTime = ({ assignation, duration }) =>
  useMemo(() => {
    const startDate = dayjs(assignation?.timestamps?.start || null);
    const durationSeconds = duration?.asSeconds();

    if (!startDate.isValid() || !durationSeconds) {
      return null;
    }
    const endDate = startDate.add(durationSeconds, 'seconds');

    if (!endDate.isValid()) {
      return null;
    }

    return endDate.diff(dayjs(), 'milliseconds');
  }, [assignation?.timestamps?.start, duration?.asSeconds()]);

function useCountdownColor({ total, remaining }) {
  const percentage = remaining / (total ?? 1);

  if (percentage >= 0.5) {
    return { color: 'success', blink: false };
  }

  if (percentage > 0.3) {
    return { color: 'warning', blink: false };
  }

  if (percentage > 0.1) {
    return { color: 'error', blink: false };
  }

  return { color: 'error', blink: true };
}

export default function Countdown({ assignation, duration, onTimeout }) {
  const remainingTime = useCountdownRemainingTime({ assignation, duration });
  const [timeLeft, { start }] = useCountdown(remainingTime, 1000);
  const timeLeftString = millisecondsToTime(timeLeft);
  const isFirstRender = useRef(true);

  const { color, blink } = useCountdownColor({
    total: duration?.asMilliseconds(),
    remaining: timeLeft,
  });

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamp = useUpdateTimestamps(mutateAsync, assignation);

  const { classes, cx } = useTimerStyles();

  if (timeLeft <= 0 && !assignation?.timestamps?.end && !isFirstRender.current) {
    updateTimestamp('end');
    onTimeout();
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    start();
  }, []);

  return (
    <Text
      color={color}
      className={cx(classes.text, { [classes.blinkText]: blink })}
      sx={{ minWidth: `${timeLeftString.length}ch` }}
    >
      {timeLeftString}
    </Text>
  );
}

Countdown.propTypes = {
  assignation: PropTypes.shape({
    timestamps: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  }),
  duration: PropTypes.shape({
    asSeconds: PropTypes.func,
    asMilliseconds: PropTypes.func,
  }),
  onTimeout: PropTypes.func,
};
