import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
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

  const { control, setValue, watch } = useForm({ defaultValues });

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    if (typeof onChange !== 'function') {
      return () => {};
    }
    const subscription = watch((values) => onChange(values));

    return subscription.unsubscribe;
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
