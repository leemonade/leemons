import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isArray, isFunction, map } from 'lodash';
import { useStore } from '@common';
import { Select } from '@bubbles-ui/components';
import { listProfilesRequest } from '../request';

function SelectProfile({ firstSelected, onChange, ...props }) {
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

  return <Select {...props} data={store.data} onChange={handleOnChange} />;
}

SelectProfile.propTypes = {
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export { SelectProfile };
