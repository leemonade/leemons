import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box, SearchInput, useDebouncedValue } from '@bubbles-ui/components';

import { difference } from 'lodash';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Subject, Status, Type, Sort } from './components';
import { useFiltersStyle } from './Filters.style';
import Progress from './components/Progress';

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

function useOnValueChange({ setValue, getValues, value }) {
  useEffect(() => {
    if (value) {
      const values = getValues();
      const diff = difference(value, values);
      diff.map((key) => setValue(key, value[key]));
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

  useOnChange({ control, onChange });
  useOnValueChange({ setValue, getValues, value });

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
  defaultFilters: PropTypes.object,
};
