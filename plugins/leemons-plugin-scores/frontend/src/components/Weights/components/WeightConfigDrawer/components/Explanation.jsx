import React from 'react';

import { Textarea, ContextContainer } from '@bubbles-ui/components';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function Explanation() {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer'));
  const { control } = useFormContext();
  const type = useWatch({ control, name: 'type' });

  const hasExplanation = type === 'roles' || type === 'modules';
  if (!hasExplanation) {
    return null;
  }

  return (
    <ContextContainer title={t('explanation')}>
      <Controller
        name="explanation"
        control={control}
        shouldUnregister
        render={({ field }) => <Textarea {...field} />}
      />
    </ContextContainer>
  );
}
