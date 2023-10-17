import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Box, RadioGroup, Switch, createStyles } from '@bubbles-ui/components';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import TimeUnitsInput from '@tasks/components/Inputs/TimeUnitsInput';
import { Container } from '../Container';
import { PeriodPicker } from './PeriodPicker';

export const useActivityDatesPickerStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.xlg,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.padding.lg,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.sm,
  },
}));

function useOnChange({ control, onChange }) {
  const { type, dates, hideFromCalendar, maxTimeToggle, maxTime } = useWatch({ control });

  React.useEffect(() => {
    if (typeof onChange !== 'function') {
      return;
    }

    const isAlwaysAvailable = type === 'alwaysAvailable';
    onChange({
      alwaysAvailable: isAlwaysAvailable,
      dates: isAlwaysAvailable
        ? null
        : { ...dates, visualization: hideFromCalendar ? undefined : new Date() },
      hideFromCalendar: !!hideFromCalendar,
      maxTime: maxTimeToggle ? maxTime : null,
      raw: { type, dates, hideFromCalendar, maxTimeToggle, maxTime },
    });
  }, [type, dates, hideFromCalendar, maxTimeToggle, maxTime]);
}

export function ActivityDatesPicker({
  localizations,
  onChange,
  value,
  error,
  hideSectionHeaders,
  hideMaxTime,
}) {
  const options = React.useMemo(
    () => [
      {
        value: 'alwaysAvailable',
        label: localizations?.optionsInput?.options?.alwaysAvailable,
      },
      {
        value: 'fixed',
        label: localizations?.optionsInput?.options?.fixed,
      },
      {
        value: 'session',
        label: localizations?.optionsInput?.options?.session,
      },
    ],
    [localizations?.optionsInput?.options]
  );

  const { control } = useForm({
    defaultValues: {
      type: 'alwaysAvailable',
      maxTime: '1 hours',
      ...value?.raw,
    },
  });
  const type = useWatch({ control, name: 'type' });
  useOnChange({ onChange, control });

  const { classes } = useActivityDatesPickerStyles();
  return (
    <Container title={localizations?.title} hideSectionHeaders={hideSectionHeaders}>
      <Box className={classes.root}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} data={options} label={localizations?.optionsInput?.label} />
          )}
        />
        <Box className={classes.content}>
          {(type === 'fixed' || type === 'session') && (
            <Controller
              name="dates"
              control={control}
              shouldUnregister
              render={({ field }) => (
                <PeriodPicker
                  {...field}
                  localizations={localizations?.fixedType}
                  sameDay={type === 'session'}
                  error={error}
                />
              )}
            />
          )}
          <Box className={classes.switchContainer}>
            {type !== 'alwaysAvailable' && (
              <Controller
                name="hideFromCalendar"
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={!!field.value}
                    label={localizations?.hideFromCalendar}
                  />
                )}
              />
            )}
            {!hideMaxTime && (
              <Controller
                name="maxTimeToggle"
                control={control}
                render={({ field: maxTimeToggleField }) => (
                  <ConditionalInput
                    {...maxTimeToggleField}
                    checked={!!maxTimeToggleField.value}
                    label={localizations?.maxTime}
                    showOnTrue
                    render={() => (
                      <Controller
                        name="maxTime"
                        control={control}
                        render={({ field }) => (
                          <TimeUnitsInput
                            {...field}
                            label={localizations?.maxTimeInput?.label}
                            min={1}
                          />
                        )}
                      />
                    )}
                  />
                )}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

ActivityDatesPicker.propTypes = {
  localizations: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.func,
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
  hideMaxTime: PropTypes.bool,
};
