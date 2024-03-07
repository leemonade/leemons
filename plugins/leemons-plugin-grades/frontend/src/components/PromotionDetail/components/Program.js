import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';

const Program = ({ messages, errorMessages, selectData, form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Controller
      name="program"
      control={control}
      rules={{
        required: errorMessages.programRequired,
      }}
      render={({ field }) => (
        <Select
          data={selectData.programs}
          label={messages.programLabel}
          placeholder={messages.programPlaceholder}
          error={errors.program}
          required
          {...field}
        />
      )}
    />
  );
};

Program.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
};

export { Program };
