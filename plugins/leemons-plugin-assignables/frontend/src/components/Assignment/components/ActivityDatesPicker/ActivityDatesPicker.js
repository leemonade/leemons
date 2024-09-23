import React, { useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { Box, RadioGroup, createStyles, LoadingOverlay  } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { Container } from '../Container';

import {ActivityDatesPickerProvider} from './context/ActivityDatesPickerProvider';
import useDatesPickerOptions from './hooks/useDatesPickerOptions';




export const useActivityDatesPickerStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // gap: theme.other.global.spacing.padding.xlg,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    // gap: theme.other.global.spacing.padding.lg,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    // gap: theme.other.global.spacing.gap.sm,
    marginTop: theme.other.global.spacing.gap.md,
  },
}));

function useOnChange({ control, onChange }) {
  const { type, dates, hideFromCalendar, maxTimeToggle, maxTime, ...others } = useWatch({ control });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOthers = useMemo(() => others, [JSON.stringify(others)]);

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
      others: memoizedOthers,
      raw: { type, dates, hideFromCalendar, maxTimeToggle, maxTime, ...memoizedOthers },
    });
  }, [type, dates, hideFromCalendar, maxTimeToggle, maxTime, onChange, memoizedOthers]);
}

export function ActivityDatesPicker({
  localizations,
  onChange,
  value,
  error,
  hideSectionHeaders,
  hideMaxTime,
  hideShowInCalendar,
}) {
  const {options, components, isLoading} = useDatesPickerOptions();

  const form = useForm({
    defaultValues: {
      type: 'alwaysAvailable',
      maxTime: '1 hours',
      ...value?.raw,
    },
  });
  const control = form.control;

  const type = useWatch({ control, name: 'type' });
  useOnChange({ onChange, control });

  const { classes } = useActivityDatesPickerStyles();

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  const TypeComponent = components[type];

  return (
    <ActivityDatesPickerProvider values={{
      form,

      localizations,

      hideSectionHeaders,
      hideMaxTime,
      hideShowInCalendar,
      error
    }}
    >
      <Container
      title={localizations?.title}
      required
      hideSectionHeaders={hideSectionHeaders}
      spacingBottom={16}
    >
      <Box className={classes.root}>
      <Controller
          name="type"
          control={control}
          render={({ field }) => <RadioGroup {...field} minWidth data={options} />}
        />
        {
          type && components[type] ? <TypeComponent form={form} /> : null
        }
      </Box>
      </Container>
    </ActivityDatesPickerProvider>
  );
}

ActivityDatesPicker.propTypes = {
  localizations: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.func,
  error: PropTypes.any,
  hideSectionHeaders: PropTypes.bool,
  hideMaxTime: PropTypes.bool,
  hideShowInCalendar: PropTypes.bool,
};
