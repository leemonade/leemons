import React from 'react';
import CenterAlignedSelect from '../CenterAlignedSelect';

export default function Subject({ labels, value, onChange }) {
  return (
    <CenterAlignedSelect
      orientation="horizontal"
      label={labels?.subject}
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
