import { MultiSelect, Select } from '@bubbles-ui/components';
import { getCentersWithToken } from '@users/session';
import { isArray, isFunction, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function SelectCenter({ multiple = false, firstSelected, onChange, value: userValue, ...props }) {
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);

  const handleOnChange = (val) => {
    if (val !== value) {
      setValue(val);
      if (isFunction(onChange)) {
        onChange(val);
      }
    }
  };

  useEffect(() => {
    setValue(userValue);
  }, [userValue]);

  useEffect(() => {
    const centers = getCentersWithToken();
    if (isArray(centers)) {
      const values = map(centers, ({ name, id }) => ({
        label: name,
        value: id,
      }));
      setData(values);

      if (firstSelected) {
        handleOnChange(values[0].value);
      }
    }
  }, []);

  if (multiple)
    return (
      <MultiSelect
        {...props}
        data={data}
        value={value}
        autoSelectOneOption
        onChange={handleOnChange}
      />
    );

  return (
    <Select {...props} data={data} value={value} autoSelectOneOption onChange={handleOnChange} />
  );
}

SelectCenter.propTypes = {
  multiple: PropTypes.bool,
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export { SelectCenter };
export default SelectCenter;
