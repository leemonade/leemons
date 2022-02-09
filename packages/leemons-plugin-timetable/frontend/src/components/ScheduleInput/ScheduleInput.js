import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil, isString } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SchedulePicker } from '@bubbles-ui/leemons';
import { unflatten } from '@common';
import { prefixPN } from '../../helpers';

const ScheduleInput = ({ label, ...props }) => {
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

  return !isNil(pickerProps) ? <SchedulePicker {...pickerProps} {...props} /> : null;
};

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
