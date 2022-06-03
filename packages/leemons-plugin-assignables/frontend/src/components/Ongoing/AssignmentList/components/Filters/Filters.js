import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { difference } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { Box, SearchInput, SegmentedControl } from '@bubbles-ui/components';
import { Subject, Status, Type } from './components';
import { useFiltersStyle } from './Filters.style';

export default function Filters({
  labels,
  tabs,
  onChange,
  value,
  hideTabs,
  hideQuery,
  hideSubject,
  hideStatus,
  hideType,
}) {
  /*
    --- FORM STATE ---
  */
  const defaultValues = useMemo(
    () => ({
      subject: 'all',
      status: 'all',
      type: 'all',
      tab: tabs?.[0]?.value,
      query: '',
    }),
    [tabs]
  );

  const { control, setValue, getValues, watch } = useForm({ defaultValues });

  useEffect(() => {
    if (value) {
      const values = getValues();

      const diff = difference(value, values);

      diff.map((key) => setValue(key, value[key]));
    }
  }, [value]);

  useEffect(() => {
    if (typeof onChange !== 'function') {
      return () => {};
    }

    let timer;
    const subscription = watch((values) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        onChange(values);

        clearTimeout(timer);
        timer = null;
      }, 200);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [watch, onChange]);

  /*
    --- RENDER ---
  */

  const { classes, cx } = useFiltersStyle();

  const topBar = !(hideTabs && hideQuery) && (
    <Box className={cx(classes?.filterRow, classes?.spaceBetween, classes?.alignCenter)}>
      {hideTabs ? (
        <Box />
      ) : (
        <Controller
          control={control}
          name="tab"
          render={({ field }) => (
            <SegmentedControl
              classNames={{
                root: classes.segmentRoot,
                label: classes.segmentLabel,
                active: classes.segmentActive,
                labelActive: classes.segmentLabelActive,
                control: classes.segmentControl,
              }}
              data={tabs}
              {...field}
            />
          )}
        />
      )}
      {hideQuery ? (
        <Box />
      ) : (
        <Box className={classes?.halfWidth}>
          <Controller
            control={control}
            name="query"
            render={({ field }) => <SearchInput placeholder={labels?.search} {...field} />}
          />
        </Box>
      )}
    </Box>
  );
  const bottomBar = !(hideSubject && hideStatus && hideType) && (
    <Box className={cx(classes?.filterRow, classes?.gap, classes?.multiRow)}>
      {hideSubject || (
        <Controller
          name="subject"
          control={control}
          render={({ field }) => <Subject labels={labels} {...field} />}
        />
      )}
      {hideStatus || (
        <Controller
          name="status"
          control={control}
          render={({ field }) => <Status labels={labels} {...field} />}
        />
      )}
      {hideType || (
        <Controller
          name="type"
          control={control}
          render={({ field }) => <Type labels={labels} {...field} />}
        />
      )}
    </Box>
  );

  return (
    <Box className={classes?.root}>
      {topBar}
      {bottomBar}
    </Box>
  );
}

Filters.propTypes = {
  labels: PropTypes.object,
  tabs: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.object,
  hideTabs: PropTypes.bool,
  hideQuery: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideType: PropTypes.bool,
};
