import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Table, Stack, Switch } from '@bubbles-ui/components';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useColumns from './hooks/useColumns';
import useDefaultValues from './hooks/useDefaultValues';
import useOnChange from './hooks/useOnChange';
import useApplySameValue from './hooks/useApplySameValue';
import RenderInvalidPercentageError from './components/RenderInvalidPercentageError';
import NewModulesAlert from './components/NewModulesAlert';

export default function WeightTable({ type, data: _data, lockable, onChange }) {
  const [t] = useTranslateLoader(prefixPN('weightingDrawer.table'));
  const columns = useColumns({ type, lockable });

  const defaultValues = useDefaultValues(_data);
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const data = useMemo(
    () => [
      ...defaultValues.data,
      {
        id: 'total',
        name: t('total'),
      },
    ],
    [defaultValues.data, t]
  );

  useOnChange(form, onChange);
  useApplySameValue(form);

  return (
    <FormProvider {...form}>
      <Stack direction="column" spacing={2}>
        <NewModulesAlert type={type} data={_data} />
        <Controller
          name="applySameValue"
          control={form.control}
          render={({ field }) => (
            <Switch label={t('applySameValue')} {...field} checked={!!field.value} />
          )}
        />
        {!!defaultValues.data?.length && <Table columns={columns} data={data} />}
        <RenderInvalidPercentageError control={form.control} />
      </Stack>
    </FormProvider>
  );
}

WeightTable.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  lockable: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};
