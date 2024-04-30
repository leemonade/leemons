import React from 'react';

import { createStyles, SearchInput, Select, Stack, Switch } from '@bubbles-ui/components';
import { unflatten } from '@common';
import _ from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { useFilterByLength } from '../Notebook/components/ActivitiesTab/Filters';

function useFiltersLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('finalNotebook.filters'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('finalNotebook.filters'));
    }

    return {};
  }, [translations]);
}

function useSearchByData({ localizations, filters }) {
  return React.useMemo(() => {
    if (!localizations?.filterBy) {
      return [];
    }

    const filterBy = !filters?.group
      ? localizations?.filterBy
      : _.omit(localizations?.filterBy, ['group']);

    return Object.entries(filterBy)?.map(([value, label]) => ({
      value,
      label,
    }));
  }, [localizations?.filterBy, filters?.group]);
}

function useEmitOnChange({ control, onChange }) {
  const data = useWatch({ control });

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(data);
    }
  }, [data, onChange]);
}
export function Filters({ onChange }) {
  const localizations = useFiltersLocalizations();

  const { control, watch } = useForm({
    defaultValues: {
      filterBy: 'student',
      search: '',
      futureEvaluations: true,
    },
  });
  const searchByData = useSearchByData({ localizations });
  const filterByLength = useFilterByLength(searchByData);

  useEmitOnChange({ control, onChange });

  return (
    <Stack justifyContent="space-between">
      <Stack spacing={3}>
        <Controller
          control={control}
          name={'filterBy'}
          render={({ field }) => (
            <Select
              {...field}
              data={searchByData}
              style={{
                width: `${filterByLength + 5}ch`,
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
              }}
            />
          )}
        />

        <Controller
          control={control}
          name={'search'}
          render={({ field }) => {
            const searchBy = watch('filterBy');
            const placeholder = localizations?.searchBy?.replace(
              '{{noun}}',
              localizations?.filterBy[searchBy]
            );

            return <SearchInput {...field} placeholder={placeholder} wait={300} />;
          }}
        />
      </Stack>

      <Controller
        control={control}
        name={'futureEvaluations'}
        render={({ field }) => (
          <Switch
            {...field}
            checked={!field.value}
            onChange={(v) => field.onChange(!v)}
            label={localizations?.hideFutureEvaluations}
          />
        )}
      />
    </Stack>
  );
}

export default Filters;
