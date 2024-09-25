import React from 'react';
import { Controller } from 'react-hook-form';


import TimeUnitsInput from '@common/components/TimeUnitsInput';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';

import { useActivityDatesPickerContext } from '../context/ActivityDatesPickerProvider';

export default function MaxTimeToggle() {
  const { form, localizations, hideMaxTime } = useActivityDatesPickerContext();

  if (hideMaxTime) {
    return null;
  }

  return (
    <Controller
    name="maxTimeToggle"
    control={form.control}
    render={({ field: maxTimeToggleField }) => (
      <ConditionalInput
        {...maxTimeToggleField}
        checked={!!maxTimeToggleField.value}
        label={localizations?.maxTime}
        display="checkbox"
        showOnTrue
        render={() => (
          <Controller
            name="maxTime"
            control={form.control}
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
)};
