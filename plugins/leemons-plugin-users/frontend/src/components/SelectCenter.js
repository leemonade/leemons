import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isArray, isFunction, map, noop } from 'lodash';
import { MultiSelect, Select } from '@bubbles-ui/components';
import { listCentersRequest } from '@users/request';
import { getCentersWithToken } from '@users/session';

function SelectCenter({
  multiple = false,
  allCentersIfCan = false,
  additionalData,
  firstSelected,
  onChange,
  autoSelectOneOption = true,
  value: userValue,
  onLoadCenters = noop,
  ...props
}) {
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

  async function loadData() {
    if (allCentersIfCan) {
      try {
        const {
          data: { items: centers },
        } = await listCentersRequest({
          page: 0,
          size: 999999,
        });
        if (isArray(centers)) {
          const values = map(centers, ({ name, id }) => ({
            label: name,
            value: id,
          }));
          setData(values);
          onLoadCenters(centers);

          if (firstSelected) {
            handleOnChange(values[0].value);
          }
        }
        return;
      } catch (e) {
        // Nothing to do
      }
    }

    const centers = getCentersWithToken();
    if (isArray(centers)) {
      const values = map(centers, ({ name, id }) => ({
        label: name,
        value: id,
      }));
      setData(values);
      onLoadCenters(centers);

      if (firstSelected) {
        handleOnChange(values[0].value);
      }
    }
  }

  useEffect(() => {
    setValue(userValue);
  }, [userValue]);

  useEffect(() => {
    loadData();
  }, []);

  let dataToRender = data;
  if (additionalData) {
    dataToRender = [...additionalData, ...data];
  }

  if (multiple)
    return (
      <MultiSelect
        {...props}
        data={dataToRender}
        value={value}
        autoSelectOneOption={autoSelectOneOption}
        onChange={handleOnChange}
      />
    );

  return (
    <Select
      {...props}
      data={dataToRender}
      value={value}
      autoSelectOneOption={autoSelectOneOption}
      onChange={handleOnChange}
    />
  );
}

SelectCenter.propTypes = {
  multiple: PropTypes.bool,
  allCentersIfCan: PropTypes.bool,
  additionalData: PropTypes.any,
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  autoSelectOneOption: PropTypes.bool,
  onLoadCenters: PropTypes.func,
};

export { SelectCenter };
export default SelectCenter;
