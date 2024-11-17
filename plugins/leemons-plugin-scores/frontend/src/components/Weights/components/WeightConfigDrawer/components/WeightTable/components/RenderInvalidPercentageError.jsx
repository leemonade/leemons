import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@bubbles-ui/components';
import { useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function RenderInvalidPercentageError({ control }) {
  const [t] = useTranslateLoader(prefixPN('weightingAlerts'));
  const weightExceed = useWatch({ control, name: 'weightExceed' });

  if (weightExceed === 1) {
    return (
      <Alert severity="warning" closeable={false}>
        {t('exceedPercentageUpper')}
      </Alert>
    );
  }

  if (weightExceed === -1) {
    return (
      <Alert severity="warning" closeable={false}>
        {t('exceedPercentageLower')}
      </Alert>
    );
  }

  return null;
}

RenderInvalidPercentageError.propTypes = {
  control: PropTypes.object.isRequired,
};
