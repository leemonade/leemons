import React, { useEffect, useState } from 'react';
import { getCentersWithToken } from '@users/session';
import { Select } from '@bubbles-ui/components';
import { map, isArray } from 'lodash';

function SelectCenter({ ...props }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const centers = getCentersWithToken();
    if (isArray(centers)) {
      setData(
        map(centers, ({ name, id }) => ({
          label: name,
          value: id,
        }))
      );
    }
  }, []);

  return <Select {...props} data={data} />;
}

export { SelectCenter };
export default SelectCenter;
