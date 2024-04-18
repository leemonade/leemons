import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Switch } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';

const IsPercentage = ({ form }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const { watch, control } = form;

  const disabled = !!watch('id');

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
};

export { IsPercentage };
