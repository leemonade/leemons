import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box, SearchInput, useDebouncedValue } from '@bubbles-ui/components';

import { difference, map, pick } from 'lodash';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useQuery } from '@common';
import { useHistory } from 'react-router-dom';
import { Subject, Status, Type, Sort } from './components';
import { useFiltersStyle } from './Filters.style';
import Progress from './components/Progress';
import { useRoles } from './components/Type/Type';
import { useSortTypes } from './components/Sort/Sort';
import { useProgress } from './components/Progress/Progress';

function useOnChange({ control, onChange }) {
  const value = useWatch({
    control,
    disabled: typeof onChange !== 'function',
  });

  const [debouncedValue] = useDebouncedValue(value);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);
}

function valueMatchesValidValuesAndIsDifferent(newValue, oldValue, validValues) {
  return newValue && newValue !== oldValue && validValues.includes(newValue);
}

function useOnRouterChange({ setValue, getValues, useRouter }) {
  const params = useQuery();
  const _roleTypes = useRoles();
  const _sortTypes = useSortTypes();
  const _progressTypes = useProgress();

  const roleTypes = React.useMemo(() => map(_roleTypes, 'value'), [_roleTypes]);
  const sortTypes = React.useMemo(() => map(_sortTypes, 'value'), [_sortTypes]);
  const progressTypes = React.useMemo(() => map(_progressTypes, 'value'), [_progressTypes]);

  React.useEffect(() => {
    if (!useRouter) {
      return;
    }

    const { type, sort, query, progress } = params;
    const currentValues = getValues();

    if (valueMatchesValidValuesAndIsDifferent(type, currentValues.type, roleTypes)) {
      setValue('type', type);
    }

    if (query && query !== currentValues.query) {
      setValue('query', query);
    }

    if (valueMatchesValidValuesAndIsDifferent(sort, currentValues.sort, sortTypes)) {
      setValue('sort', sort);
    }

    if (valueMatchesValidValuesAndIsDifferent(progress, currentValues.progress, progressTypes)) {
      setValue('progress', progress);
    }
  }, [params, roleTypes, sortTypes]);
}

function useOnValueChange({ setValue, getValues, value, useRouter }) {
  const history = useHistory();

  useEffect(() => {
    if (value) {
      const values = getValues();
      const diff = difference(value, values);
      diff.map((key) => setValue(key, value[key]));

      if (useRouter) {
        const searchParams = new URLSearchParams();
        ['type', 'sort', 'query', 'progress'].forEach((key) => {
          searchParams.append(key, values[key]);
        });
        history.push(`?${searchParams.toString()}`);
      }
    }
  }, [value]);
}

export default function Filters({
  labels,
  tabs,
  defaultFilters,
  onChange,
  value,
  hideSubject,
  hideStatus,
  hideProgress,
  hideType,
  useRouter = false,
}) {
  const defaultValues = useMemo(
    () => ({
      subject: 'all',
      status: 'all',
      progress: 'all',
      type: 'all',
      sort: 'assignation',
      query: '',
      ...defaultFilters,
    }),
    [tabs]
  );
  const { control, setValue, getValues } = useForm({
    defaultValues,
  });

  const { classes, cx } = useFiltersStyle();

  useOnChange({ control, onChange, useRouter });
  useOnValueChange({ setValue, getValues, value, useRouter });
  useOnRouterChange({ setValue, getValues, useRouter });

  return (
    <Box className={cx(classes?.root)}>
      <Box className={classes.search}>
        <Controller
          control={control}
          name="query"
          render={({ field }) => (
            <SearchInput
              placeholder={labels?.search}
              label={labels?.search}
              variant="filled"
              {...field}
            />
          )}
        />
      </Box>
      {!!hideSubject || (
        <Box className={classes.input}>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => <Subject labels={labels} {...field} />}
          />
        </Box>
      )}
      {!!hideStatus || (
        <Box className={classes.input}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => <Status labels={labels} {...field} />}
          />
        </Box>
      )}
      {!!hideProgress || (
        <Box className={classes.input}>
          <Controller
            name="progress"
            control={control}
            render={({ field }) => <Progress labels={labels} {...field} />}
          />
        </Box>
      )}
      {!!hideType || (
        <Box className={classes.input}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => <Type labels={labels} {...field} />}
          />
        </Box>
      )}
      {!!hideType || (
        <Box className={classes.input}>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => <Sort labels={labels} {...field} />}
          />
        </Box>
      )}
    </Box>
  );
}

Filters.propTypes = {
  labels: PropTypes.object,
  tabs: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.object,
  hideSubject: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideProgress: PropTypes.bool,
  hideType: PropTypes.bool,
  useRouter: PropTypes.bool,
  defaultFilters: PropTypes.object,
};
