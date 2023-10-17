import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';
import { map } from 'lodash';

const MinScaleToPromote = ({ messages, errorMessages, form }) => {
  const {
    watch,
    control,
    formState: { errors },
  } = form;

  const scales = watch('scales');
  let data = [];
  if (scales) {
    data = map(scales, ({ number }) => ({
      label: number,
      value: number,
    }));
  }

  return (
    <Controller
      name="minScaleToPromote"
      control={control}
      rules={{
        required: errorMessages.minScaleToPromoteRequired,
      }}
      render={({ field }) => (
        <Select
          data={data}
          label={messages.minScaleToPromoteLabel}
          placeholder={messages.minScaleToPromotePlaceholder}
          error={errors.minScaleToPromote}
          required
          {...field}
        />
      )}
    />
  );
};

MinScaleToPromote.propTypes = {
  messages: PropTypes.object.isRequired,
  errorMessages: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export { MinScaleToPromote };
