import React from 'react';
import { Controller } from 'react-hook-form';

import { Checkbox } from '@bubbles-ui/components';

import { useActivityDatesPickerContext } from '../context/ActivityDatesPickerProvider';

export default function HideFromCalendar() {
  const { form, localizations, hideShowInCalendar } = useActivityDatesPickerContext();

  if (hideShowInCalendar) {
    return null;
  }

  return (
    <Controller
      name="hideFromCalendar"
      control={form.control}
        shouldUnregister
        render={({ field }) => (
          <Checkbox
            {...field}
            checked={!!field.value}
            label={localizations?.hideFromCalendar}
          />
        )}
      />
)};
