import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Select, ContextContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

import { prefixPN } from '@scores/helpers';

export default function SelectType() {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer'));
  const [typesT] = useTranslateLoader(prefixPN('weightingTypes'));
  const { control } = useFormContext();

  const data = useMemo(
    () => [
      {
        label: typesT('averages'),
        value: 'averages',
      },
      {
        label: typesT('roles'),
        value: 'roles',
      },
      {
        label: typesT('modules'),
        value: 'modules',
      },
    ],
    [typesT]
  );

  return (
    <ContextContainer title={typesT('rules')}>
      <Controller
        name="type"
        control={control}
        defaultValue="averages"
        render={({ field }) => <Select {...field} data={data} label={t('type')} />}
      />
    </ContextContainer>
  );
}
