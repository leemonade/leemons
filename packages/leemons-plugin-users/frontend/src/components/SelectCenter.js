import React from 'react';
import { getCentersWithToken } from '@users/session';
import { Select } from '@bubbles-ui/components';
import {map, isArray} from "lodash";

function SelectCenter(props) {

  let data = [];
  const centers = getCentersWithToken();
  if (isArray(centers)) {
    data = map(centers, ({name, id}) => ({
      label: name,
      value: id,
    }));
  }

  return <Select {...props} data={data}/>

}

export { SelectCenter };
