import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Text,
  DatePicker,
  TimeInput,
  InputWrapper,
  createStyles,
} from '@bubbles-ui/components';
import { TimeClockCircleIcon } from '@bubbles-ui/icons/outline';

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
    flexDirection: 'row',
    alignItems: 'end',
    gap: theme.other.global.spacing.padding.lg,
  },
}));

export function PeriodPicker({ value, onChange, localizations, sameDay, error }) {
  const { classes } = usePeriodPickerStyles();

  const [startDate, setStartDate] = React.useState(value?.start || null);
  const [deadline, setDeadline] = React.useState(value?.deadline || null);

  const dayjsStartDate = dayjs(startDate);
  const dayjsDeadline = dayjs(deadline);

  React.useEffect(() => {
    let newDeadline = deadline;

    if (!startDate || !deadline || !dayjsStartDate.isBefore(dayjsDeadline)) {
      if (startDate) {
        if (sameDay) {
          if (dayjsStartDate.format('HH') === '23') {
            if (dayjsStartDate.format('HH:mm') === '23:59') {
              setStartDate(dayjsStartDate.set('minute', 58).toDate());
            }
            newDeadline = dayjsStartDate.set('minute', 59).toDate();
          } else {
            newDeadline = dayjsStartDate.add(1, 'hour').toDate();
          }
        } else {
          newDeadline = dayjsStartDate.add(1, 'day').set('hours', 23).set('minutes', 59).toDate();
        }
      } else {
        newDeadline = null;
      }
    } else if (
      sameDay &&
      dayjsStartDate.format('YYYY-MM-DD') !== dayjsDeadline.format('YYYY-MM-DD')
    ) {
      newDeadline = dayjs(startDate)
        .set('hours', deadline.getHours())
        .set('minutes', deadline.getMinutes())
        .toDate();
    }

    if (newDeadline !== deadline) {
      setDeadline(newDeadline);
    }

    onChange({
      start: startDate,
      deadline: newDeadline,
    });
  }, [startDate, deadline, sameDay]);

  return (
    <Box className={classes.root}>
      <Text className={classes.title}>
        {sameDay ? localizations?.title?.session : localizations?.title?.fixed}
      </Text>
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
            maxDate={!sameDay && dayjs(deadline).subtract(1, 'minutes').toDate()}
            onChange={setStartDate}
            withTime
          />
          {sameDay ? (
            <TimeInput
              value={deadline}
              disabled={!startDate}
              icon={<TimeClockCircleIcon />}
              onChange={(v) => {
                const newDeadline = dayjs(startDate)
                  .set('hour', v.getHours())
                  .set('minute', v.getMinutes())
                  .toDate();

                setDeadline(newDeadline);
              }}
            />
          ) : (
            <DatePicker
              label={localizations?.deadline?.label}
              placeholder={localizations?.deadline?.placeholder}
              minDate={dayjs(startDate).add(1, 'minutes').toDate()}
              value={deadline}
              disabled={!startDate}
              clearable={false}
              withTime
              onChange={setDeadline}
            />
          )}
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
