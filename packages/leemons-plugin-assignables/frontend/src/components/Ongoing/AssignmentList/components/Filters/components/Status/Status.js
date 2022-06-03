import React from 'react';
import CenterAlignedSelect from '../CenterAlignedSelect';

export default function Status({ labels, value, onChange }) {
  return (
    <CenterAlignedSelect
      orientation="horizontal"
      label={labels?.status}
      data={[
        {
          label: labels?.seeAll,
          value: 'all',
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
