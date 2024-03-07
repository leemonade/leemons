import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';

const Subject = ({ messages, errorMessages, selectData, form }) => {
  const {
    watch,
    control,
    formState: { errors },
  } = form;

  const program = watch('program');

  return (
    <Controller
      name="subject"
      control={control}
      rules={{
        required: errorMessages.subjectRequired,
      }}
      render={({ field }) => (
        <Select
          data={selectData.subjects}
          label={messages.subjectLabel}
          placeholder={messages.subjectPlaceholder}
          error={errors.subject}
          required
          disabled={!program}
          {...field}
        />
      )}
    />
  );
};

Subject.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
};

export { Subject };
