import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextInput } from '@bubbles-ui/components';

const Name = ({ messages, errorMessages, form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: errorMessages.nameRequired,
      }}
      render={({ field }) => (
        <TextInput
          label={messages.nameLabel}
          placeholder={messages.namePlaceholder}
          error={errors.name}
          required
          {...field}
        />
      )}
    />
  );
};

Name.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export { Name };
