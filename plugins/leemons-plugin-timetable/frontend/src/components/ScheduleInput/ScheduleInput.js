import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray, isNil, isString, map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SchedulePicker } from '@bubbles-ui/leemons';
import { unflatten } from '@common';
import { prefixPN } from '../../helpers';

const ScheduleInput = forwardRef(({ label, ...props }, ref) => {
  const [pickerProps, setPickerProps] = useState(null);
  const [, translations] = useTranslateLoader(prefixPN('schedule_picker'));

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.timetable.schedule_picker;

      if (!isNil(data.labels)) {
        if (!label) data.labels.input = '';
        if (isString(label)) data.labels.input = label;

        setPickerProps(data);
      }
    }
  }, [translations, label]);

  let value;
  if (props.value && isArray(props.value.days)) {
    value = { ...props.value };
    value.days = map(value.days, (day) => ({ ...day }));
  }

  return !isNil(pickerProps) ? (
    <SchedulePicker {...pickerProps} {...props} ref={ref} value={value} />
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
