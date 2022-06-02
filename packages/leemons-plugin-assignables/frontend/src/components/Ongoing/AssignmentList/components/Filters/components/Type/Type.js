import React from 'react';
import { Select } from '@bubbles-ui/components';

export default function Type({ labels, value, onChange }) {
  return (
    <Select
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
