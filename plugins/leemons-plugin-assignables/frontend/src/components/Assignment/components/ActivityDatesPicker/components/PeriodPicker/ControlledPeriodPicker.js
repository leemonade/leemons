import { Controller } from 'react-hook-form';

import PropTypes from 'prop-types';

import { useActivityDatesPickerContext } from '../../context/ActivityDatesPickerProvider';

import { PeriodPicker } from './PeriodPicker';

export default function ControlledPeriodPicker({ sameDay }) {
  const { form, localizations, error, startDate, endDate } = useActivityDatesPickerContext();

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
          startDate={startDate}
          endDate={endDate}
        />
      )}
    />
  );
}

ControlledPeriodPicker.propTypes = {
  sameDay: PropTypes.bool,
};
