import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Switch } from '@bubbles-ui/components';

const IsPercentage = ({ messages, form }) => {
  const {
    watch,
    control,
    formState: { errors },
  } = form;

  const disabled = !!watch('id');

  return (
    <Controller
      name="isPercentage"
      control={control}
      render={({ field }) => (
        <Switch
          label={messages.percentagesLabel}
          disabled={disabled}
          error={errors.isPercentage}
          required
          {...field}
        />
      )}
    />
  );
};

IsPercentage.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export { IsPercentage };
