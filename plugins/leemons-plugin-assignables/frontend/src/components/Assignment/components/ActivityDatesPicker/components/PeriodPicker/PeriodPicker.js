import React, { useState, useEffect } from 'react';

import { Box, Text, DatePicker, InputWrapper, createStyles } from '@bubbles-ui/components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export const usePeriodPickerStyles = createStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.lg,
  },
  title: {
    ...theme.other.global.content.typo.body['md--bold'],
    color: theme.other.global.content.color.text.default,
  },
  dates: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: theme.other.global.spacing.padding.lg,
  },
}));

function calculateNewDeadline(startDate, dayjsStartDate) {
  let newDeadline;
  if (startDate) {
    newDeadline = dayjsStartDate.add(1, 'day').set('hours', 23).set('minutes', 59).toDate();
  } else {
    newDeadline = null;
  }
  return newDeadline;
}

function updateDeadline(startDate, deadline) {
  let newDeadline = deadline;
  const dayjsStartDate = dayjs(startDate);
  const dayjsDeadline = dayjs(deadline);

  if (!startDate || !deadline || !dayjsStartDate.isBefore(dayjsDeadline)) {
    newDeadline = calculateNewDeadline(startDate, dayjsStartDate);
  }

  return newDeadline;
}

export function PeriodPicker({ value, onChange, localizations, error }) {
  const { classes } = usePeriodPickerStyles();

  const [startDate, setStartDate] = useState(value?.start || null);
  const [deadline, setDeadline] = useState(value?.deadline || null);

  useEffect(() => {
    const newDeadline = updateDeadline(startDate, deadline);

    if (newDeadline !== deadline) {
      setDeadline(newDeadline);
    }

    onChange({
      start: startDate,
      deadline: newDeadline,
    });
  }, [startDate, deadline]);

  return (
    <Box className={classes.root}>
      {!!localizations?.title?.fixed && (
        <Text className={classes.title}>{localizations?.title?.fixed}</Text>
      )}
      <InputWrapper
        error={
          error &&
          ((!startDate && !deadline && localizations?.bothDatesError) ||
            (!startDate && localizations?.startDate?.error) ||
            (!deadline && localizations?.deadline?.error))
        }
      >
        <Box className={classes.dates}>
          <DatePicker
            label={localizations?.startDate?.label}
            placeholder={localizations?.startDate?.placeholder}
            value={startDate}
            minDate={new Date()}
            maxDate={deadline ? dayjs(deadline).subtract(1, 'minutes').toDate() : undefined}
            onChange={setStartDate}
            withTime
          />
          <DatePicker
            label={localizations?.deadline?.label}
            placeholder={localizations?.deadline?.placeholder}
            minDate={startDate ? dayjs(startDate).add(1, 'minutes').toDate() : undefined}
            value={deadline}
            disabled={!startDate}
            clearable={false}
            withTime
            onChange={setDeadline}
          />
        </Box>
      </InputWrapper>
    </Box>
  );
}

PeriodPicker.propTypes = {
  localizations: PropTypes.object,
  sameDay: PropTypes.bool,
  value: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    deadline: PropTypes.instanceOf(Date),
  }),
  onChange: PropTypes.func,
  error: PropTypes.any,
};
