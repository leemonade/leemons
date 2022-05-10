import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { NumberInput, Select, Stack, InputWrapper, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '../../../helpers/prefixPN';

export default function TimeUnitsInput({ onChange, value: userValue, ...props }) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form.timeUnits'));
  const [labels, setLabels] = useState({});

  const [value, setValue] = useState(0);
  const [units, setUnits] = useState('minutes');
  const [time, setTime] = useState(`${value} ${units}`);

  useEffect(() => {
    if (translations) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.assignment_form.timeUnits;

      setLabels({
        hours: data.hours,
        minutes: data.minutes,
        days: data.days,
      });
    }
  }, [translations]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(time);
    }
  }, [time]);

  const handleChange = (v, u) => {
    const dur = `${v} ${u}`;

    if (v !== value) {
      setValue(v);
    }

    if (u !== units) {
      setUnits(u);
    }

    if (time !== dur) {
      setTime(dur);
    }
  };

  useEffect(() => {
    if (userValue !== time && userValue !== undefined) {
      const [v, ...u] = userValue.split(' ');
      handleChange(parseInt(v, 10), u.join(' '));
    }
  }, [userValue]);

  return (
    <InputWrapper {...props}>
      <Stack direction="row" spacing={1}>
        <NumberInput value={value} onChange={(v) => handleChange(v, units)} />
        <Select
          value={units}
          onChange={(u) => handleChange(value, u)}
          data={[
            {
              label: labels.minutes,
              value: 'minutes',
            },
            {
              label: labels.hours,
              value: 'hours',
            },
            {
              label: labels.days,
              value: 'days',
            },
          ]}
        />
      </Stack>
    </InputWrapper>
  );
}

TimeUnitsInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
};
