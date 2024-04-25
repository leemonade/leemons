import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextInput } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';

const Name = ({ form, inUse }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: t('errorTypeRequired'),
      }}
      render={({ field }) => (
        <TextInput
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          error={errors.name}
          required
          disabled={inUse}
          {...field}
        />
      )}
    />
  );
};

Name.propTypes = {
  form: PropTypes.object.isRequired,
  inUse: PropTypes.bool,
};

export { Name };
