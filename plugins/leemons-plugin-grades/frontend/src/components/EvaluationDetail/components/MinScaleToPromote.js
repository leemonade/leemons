import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Select } from '@bubbles-ui/components';
import { map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';

const MinScaleToPromote = ({ form, inUse }) => {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const { watch, control } = form;

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
        required: t('errorTypeRequired'),
      }}
      render={({ field, fieldState: { error } }) => (
        <Select
          data={data}
          label={t('minSacleToPromoteLabel')}
          placeholder={t('minSacleToPromotePlaceholder')}
          error={error ? t('errorTypeRequired') : null}
          required
          disabled={inUse}
          {...field}
        />
      )}
    />
  );
};

MinScaleToPromote.propTypes = {
  form: PropTypes.object.isRequired,
  inUse: PropTypes.bool,
};

export { MinScaleToPromote };
