import React from 'react';

import { Stack, Alert } from '@bubbles-ui/components';
import { useFormContext, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function PreWeightingAlerts() {
  const [t] = useTranslateLoader(prefixPN('weightingAlerts'));

  const { control } = useFormContext();

  const data = useWatch({ name: 'weights.weight', control });
  const type = useWatch({ name: 'type', control });

  return (
    <Stack direction="column" spacing={4}>
      {type === 'modules' && (
        <Alert severity="warning" closeable={false} title={t('modulesTypeWarning.title')}>
          {t('modulesTypeWarning.message')}
        </Alert>
      )}

      {type === 'modules' && !data?.length && (
        <Alert severity="warning" closeable={false} title={t('noModulesWarning.title')}>
          {t('noModulesWarning.message')}
        </Alert>
      )}
    </Stack>
  );
}
