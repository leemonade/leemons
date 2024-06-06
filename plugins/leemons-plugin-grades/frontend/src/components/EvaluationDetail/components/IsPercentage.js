import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Switch } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';

const IsPercentage = ({ form, inUse }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const { watch, control } = form;

  const disabled = !!watch('id') || inUse;

  return (
    <Controller
      name="isPercentage"
      control={control}
      render={({ field }) => <Switch label={t('percentageLabel')} disabled={disabled} {...field} />}
    />
  );
};

IsPercentage.propTypes = {
  form: PropTypes.object.isRequired,
  inUse: PropTypes.bool,
};

export { IsPercentage };
