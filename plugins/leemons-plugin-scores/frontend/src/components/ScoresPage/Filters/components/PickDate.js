import { DatePicker } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import React from 'react';
import { Controller, useWatch } from 'react-hook-form';

export default function PickDate({ control, name, defaultValue }) {
  const opposite = name === 'endDate' ? 'startDate' : 'endDate';

  const [t] = useTranslateLoader('scores.scoresPage');
  const savedDate = useWatch({ control, name: opposite });
  const date = new Date(savedDate);

  const minDate =
    name === 'endDate' && date.getTime() ? new Date(date.setDate(date.getDate() + 1)) : undefined;
  const maxDate =
    name === 'startDate' && date.getTime() ? new Date(date.setDate(date.getDate() - 1)) : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { isDirty } }) => {
        let isDefaultValue = field.value?.getTime() === defaultValue;

        if (!isDefaultValue && !isDirty) {
          field.onChange(new Date(defaultValue));
          isDefaultValue = true;
        }

        if (!isDefaultValue && name === 'endDate' && field.value && !minDate) {
          field.onChange(null);
        }

        if (!isDefaultValue && name === 'endDate' && !field.value && minDate) {
          const newDate = new Date();
          newDate.setDate(minDate.getDate() + 1);
          field.onChange(newDate);
        }

        return (
          <DatePicker
            {...field}
            minDate={minDate}
            maxDate={maxDate}
            disabled={name === 'endDate' && !minDate}
            ariaLabel={t(`${name}.label`)}
            placeholder={t(`${name}.placeholder`)}
          />
        );
      }}
    />
  );
}
