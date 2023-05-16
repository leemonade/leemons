import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';

const Grades = ({ messages, errorMessages, selectData, form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Controller
      name="grade"
      control={control}
      rules={{
        required: errorMessages.gradeRequired,
      }}
      render={({ field }) => (
        <Select
          data={selectData.grades}
          label={messages.gradeLabel}
          placeholder={messages.gradePlaceholder}
          error={errors.grade}
          required
          {...field}
        />
      )}
    />
  );
};

Grades.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
};

export { Grades };
