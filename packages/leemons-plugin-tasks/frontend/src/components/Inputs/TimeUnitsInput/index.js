import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import { NumberInput, Select, ContextContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '../../../helpers/prefixPN';

export default function TimeUnitsInput({ onChange }) {
  const [, translations] = useTranslateLoader(prefixPN('assignment_form.timeUnits'));
  const [labels, setLabels] = useState({});

  const [value, setValue] = useState(0);
  const [units, setUnits] = useState('minutes');
  const [time, setTime] = useState(0);

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

  const getMultiplier = (u) => {
    switch (u) {
      case 'seconds':
        return 1000;
      case 'minutes':
        return 1000 * 60;
      case 'hours':
        return 1000 * 60 * 60;
      case 'days':
        return 1000 * 60 * 60 * 24;
      default:
        return 1;
    }
  };

  const handleChange = (v, u) => {
    if (v !== value) {
      setValue(v);
    }

    if (u !== units) {
      setUnits(u);
    }

    const t = v * getMultiplier(u);

    if (time !== t) {
      setTime(t);
    }
  };

  return (
    <ContextContainer direction="row">
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
    </ContextContainer>
  );
}

TimeUnitsInput.propTypes = {
  onChange: PropTypes.func,
};
