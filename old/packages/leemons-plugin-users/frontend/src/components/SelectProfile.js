import { Select } from '@bubbles-ui/components';
import { useStore } from '@common';
import { isArray, isFunction, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import { listProfilesRequest } from '../request';

const SelectProfile = forwardRef(({ firstSelected, onChange, ...props }, ref) => {
  const [store, render] = useStore({
    data: [],
  });

  const handleOnChange = (val) => {
    if (val !== props.value) {
      if (isFunction(onChange)) {
        onChange(val);
      }
    }
  };

  async function init() {
    const {
      data: { items },
    } = await listProfilesRequest({
      page: 0,
      size: 9999,
    });

    if (isArray(items)) {
      store.data = map(items, ({ name, id }) => ({
        label: name,
        value: id,
      }));

      if (firstSelected) {
        handleOnChange(store.data[0].value);
      }
    }
    render();
  }

  useEffect(() => {
    init();
  }, []);

  return <Select {...props} ref={ref} data={store.data} onChange={handleOnChange} />;
});

SelectProfile.displayName = '@users/components/SelectProfile';
SelectProfile.propTypes = {
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export { SelectProfile };
export default SelectProfile;
