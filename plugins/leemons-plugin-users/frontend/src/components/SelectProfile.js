import { Select } from '@bubbles-ui/components';
import { useStore } from '@common';
import { isArray, map, noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import { listProfilesRequest } from '../request';

const SelectProfile = forwardRef(
  ({ firstSelected, showAll = true, onChange = noop, ...props }, ref) => {
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
        forceAll: showAll,
      });

      if (isArray(items)) {
        store.data = map(items, ({ name, id }) => ({
          label: name,
          value: id,
        }));

        if (firstSelected && store.data.length > 0) {
          handleOnChange(store.data[0].value);
        }
      }
      render();
    }

    useEffect(() => {
      init();
    }, []);

    return <Select {...props} ref={ref} data={store.data} onChange={handleOnChange} />;
  }
);

SelectProfile.displayName = '@users/components/SelectProfile';
SelectProfile.propTypes = {
  firstSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  showAll: PropTypes.bool,
};

export { SelectProfile };
export default SelectProfile;
