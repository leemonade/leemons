import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { prefixPN } from '../../../helpers/prefixPN';

function useMethodologyLabels() {
  const [methodologyLabels, setMethodologyLabels] = useState({});
  const [, translations] = useTranslateLoader(prefixPN('methodology'));

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.methodology;

      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
      setMethodologyLabels(
        Object.entries(data).map(([value, label]) => ({
          label,
          value,
        }))
      );
    }
  }, [translations]);

  return methodologyLabels;
}

export default function Methodology({ labels, errorMessages, placeholders, required }) {
  const methodologyLabels = useMethodologyLabels();

  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name="methodology"
      rules={{ required: required && errorMessages.methodology?.required }}
      render={({ field }) => (
        <Select
          {...field}
          data={methodologyLabels}
          label={labels.methodology}
          placeholder={placeholders.methodology}
          error={errors.methodology}
          required={required}
        />
      )}
    />
  );
}

Methodology.propTypes = {
  labels: PropTypes.shape({
    methodology: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    methodology: PropTypes.shape({
      required: PropTypes.string,
    }),
  }),
  placeholders: PropTypes.shape({
    methodology: PropTypes.string,
  }),
  required: PropTypes.bool,
};
