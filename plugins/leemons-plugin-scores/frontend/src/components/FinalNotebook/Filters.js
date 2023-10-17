import React from 'react';
import { Box, createStyles, SearchInput, Select, Switch } from '@bubbles-ui/components';
import _ from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { unflatten } from '@common';
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
  }, [localizations?.filterBy]);
}
const useFiltersStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.interactive03,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4],
    padding: theme.spacing[4],
    width: '100%',
  },
  searchByContainer: {
    display: 'flex',
    gap: theme.spacing[1],
  },
}));
function useEmitOnChange({ control, onChange }) {
  const data = useWatch({ control });

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(data);
    }
  }, [data]);
}
export function Filters({ onChange }) {
  const { classes } = useFiltersStyles();
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
    <Box className={classes.root}>
      <Box className={classes.searchByContainer}>
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
      </Box>
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
    </Box>
  );
}

export default Filters;
