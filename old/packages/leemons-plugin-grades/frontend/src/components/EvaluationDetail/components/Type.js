import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { RadioGroup } from '@bubbles-ui/components';

const Type = ({ messages, errorMessages, form, selectData }) => {
  const {
    watch,
    control,
    formState: { errors },
  } = form;

  const disabled = !!watch('id');

  return (
    <Controller
      name="type"
      control={control}
      rules={{
        required: errorMessages.typeRequired,
      }}
      render={({ field }) => (
        <RadioGroup
          label={messages.typeLabel}
          data={selectData.type}
          error={errors.type}
          required
          {...field}
          disabled={disabled}
        />
      )}
    />
  );
};

Type.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
};

export { Type };
