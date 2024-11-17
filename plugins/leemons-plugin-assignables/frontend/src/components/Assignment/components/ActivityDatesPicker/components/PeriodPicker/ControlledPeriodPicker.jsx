import React from 'react';
import { Controller } from 'react-hook-form';

import PropTypes from 'prop-types';

import { useActivityDatesPickerContext } from '../../context/ActivityDatesPickerProvider';

import { PeriodPicker } from './PeriodPicker';

export default function ControlledPeriodPicker({sameDay}) {
  const { form, localizations, error } = useActivityDatesPickerContext();


  return (
    <Controller
      name="dates"
      control={form.control}
      shouldUnregister
      render={({ field }) => (
        <PeriodPicker
          {...field}
          localizations={localizations?.fixedType}
          sameDay={sameDay}
          error={error}
        />
      )}
    />
)};

ControlledPeriodPicker.propTypes = {
  sameDay: PropTypes.bool,
};
