import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@bubbles-ui/components';
import { useFormContext, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function NewModulesAlert({ type, data }) {
  const [t] = useTranslateLoader(prefixPN('weightingAlerts'));

  const form = useFormContext();
  const { touchedFields } = form.formState;

  const weights = useWatch({ name: `weights`, control: form.control });

  const hasNewModules = useMemo(
    () =>
      data.weights.some(
        (module) =>
          module.isNew &&
          !touchedFields?.weights?.[module.id]?.weight &&
          !weights?.[module.id]?.weight
      ),
    [data.weights, JSON.stringify(touchedFields.weights), weights]
  );

  if (type === 'modules' && hasNewModules) {
    return (
      <Alert severity="warning" closeable={false}>
        {t('newModulesWarning')}
      </Alert>
    );
  }

  return null;
}

NewModulesAlert.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
