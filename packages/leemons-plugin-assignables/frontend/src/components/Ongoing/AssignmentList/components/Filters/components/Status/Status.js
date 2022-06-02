import React from 'react';
import { Select } from '@bubbles-ui/components';

export default function Status({ labels, value, onChange }) {
  return (
    <Select
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
