import React from 'react';
import CenterAlignedSelect from '../CenterAlignedSelect';

export default function Type({ labels, value, onChange }) {
  return (
    <CenterAlignedSelect
      orientation="horizontal"
      label={labels?.type}
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
