import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, TimeInput, ContextContainer } from '@bubbles-ui/components';

export default function DateTime({ label, description, value: userValue, onChange }) {
  const [date, setDate] = useState(userValue);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(date);
    }
  }, [date, onChange]);

  const getDate = () => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}/${month}/${day}`;
  };

  const getTime = () => {
    if (!date) {
      return '';
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes}`;
  };

  const updateDate = (v) => {
    const year = v.getFullYear();
    const month = v.getMonth() + 1;
    const day = v.getDate();

    const newDate = new Date(`${year}/${month}/${day} ${getTime()}`);
    setDate(newDate);
  };

  const updateTime = (v) => {
    const hours = v.getHours();
    const minutes = v.getMinutes();

    const newDate = new Date(`${getDate()} ${hours}:${minutes}`);
    setDate(newDate);
  };

  return (
    <ContextContainer direction="row" alignItems="end">
      <DatePicker
        label={label}
        value={userValue || date}
        description={description}
        onChange={updateDate}
      />
      <TimeInput onChange={updateTime} value={userValue || date} />
    </ContextContainer>
  );
}

DateTime.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
};
