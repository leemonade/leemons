import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isArray, map, noop } from 'lodash';
import { MultiSelect } from '@bubbles-ui/components';
import { useStore } from '@common';
import { listProfilesRequest } from '../request';

const MultiSelectProfile = forwardRef(({ onChange = noop, ...props }, ref) => {
  const [store, render] = useStore({
    data: [],
  });

  const handleOnChange = (val) => {
    if (val !== props.value) {
      onChange(val);
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
    }
    render();
  }

  useEffect(() => {
    init();
  }, []);

  return <MultiSelect {...props} ref={ref} data={store.data} onChange={handleOnChange} />;
});

MultiSelectProfile.displayName = '@users/components/MultiSelectProfile';
MultiSelectProfile.propTypes = {
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export { MultiSelectProfile };
export default MultiSelectProfile;
