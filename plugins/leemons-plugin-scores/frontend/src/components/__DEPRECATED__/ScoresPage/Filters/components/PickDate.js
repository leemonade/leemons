import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { Controller, useWatch } from 'react-hook-form';

export default function PickDate({ form, name, defaultValue }) {
  const opposite = name === 'endDate' ? 'startDate' : 'endDate';

  const [t] = useTranslateLoader('scores.scoresPage');
  const savedDate = useWatch({ control: form.control, name: opposite });
  const date = new Date(savedDate);

  const minDate =
    name === 'endDate' && date.getTime() ? new Date(date.setDate(date.getDate() + 1)) : undefined;
  const maxDate =
    name === 'startDate' && date.getTime() ? new Date(date.setDate(date.getDate() - 1)) : undefined;

  useEffect(() => {
    if (defaultValue) {
      form.setValue(name, new Date(defaultValue));
    }
  }, [form.setValue, name, defaultValue]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        if (name === 'endDate' && field.value && minDate === null) {
          field.onChange(null);
        }

        if (name === 'endDate' && field.value === null && minDate) {
          const newDate = new Date();
          newDate.setDate(minDate.getDate() + 1);
          field.onChange(newDate);
        }

        return (
          <DatePicker
            {...field}
            minDate={minDate}
            maxDate={maxDate}
            disabled={name === 'endDate' && !form.getValues(opposite)}
            ariaLabel={t(`${name}.label`)}
            placeholder={t(`${name}.placeholder`)}
          />
        );
      }}
    />
  );
}

PickDate.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.number,
};
