import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { Select } from '@bubbles-ui/components';

const Type = ({ form, selectData, inUse }) => {
  const {
    watch,
    control,
    formState: { errors },
  } = form;
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const disabled = !!watch('id') || inUse;
  return (
    <Controller
      name="type"
      control={control}
      rules={{
        required: t('errorTypeRequired'),
      }}
      render={({ field }) => (
        <Select
          label={t('scaleTypesLabel')}
          data={selectData.type}
          error={errors.type ? t('errorTypeRequired') : null}
          required
          placeholder={t('scaleTypesPlaceholder')}
          {...field}
          disabled={disabled}
          onChange={(value) => field.onChange(value)}
          value={field.value}
        />
      )}
    />
  );
};

Type.propTypes = {
  form: PropTypes.object.isRequired,
  selectData: PropTypes.object.isRequired,
  inUse: PropTypes.bool,
};

export { Type };
