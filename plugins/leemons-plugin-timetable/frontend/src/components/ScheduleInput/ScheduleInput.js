import React, { forwardRef, useEffect, useState, useMemo } from 'react';

import { SchedulePicker } from '@bubbles-ui/leemons';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray, isNil, isString } from 'lodash';
import PropTypes from 'prop-types';

import { prefixPN } from '../../helpers';

const ScheduleInput = forwardRef(({ label, ...props }, ref) => {
  const [pickerProps, setPickerProps] = useState(null);
  const [, translations] = useTranslateLoader(prefixPN('schedule_picker'));

  function handleTranslations() {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.timetable.schedule_picker;

      if (!isNil(data.labels)) {
        data.labels.input = isString(label) ? label : '';
        setPickerProps(data);
      }
    }
  }

  useEffect(() => {
    handleTranslations();
  }, [translations, label]);

  const sortedDays = useMemo(() => {
    if (props.value && isArray(props.value.days)) {
      return [...props.value.days].sort((a, b) => {
        const adjustedDayWeekA = a.dayWeek === 0 ? 7 : a.dayWeek;
        const adjustedDayWeekB = b.dayWeek === 0 ? 7 : b.dayWeek;
        return adjustedDayWeekA - adjustedDayWeekB;
      });
    }
    return [];
  }, [props.value?.days]);

  const internalValue = useMemo(() => {
    if (props.value && isArray(props.value.days)) {
      return { ...props.value, days: sortedDays };
    }
    return props.value;
  }, [props.value, sortedDays]);

  return !isNil(pickerProps) ? (
    <SchedulePicker {...pickerProps} {...props} ref={ref} value={internalValue} />
  ) : null;
});

ScheduleInput.displayName = '@timetable/components/ScheduleInput';
ScheduleInput.defaultProps = {
  label: true,
};

ScheduleInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export { ScheduleInput };
export default ScheduleInput;
