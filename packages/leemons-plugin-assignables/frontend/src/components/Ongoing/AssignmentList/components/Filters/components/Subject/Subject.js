import React from 'react';
import { Select } from '@bubbles-ui/components';

export default function Subject({ labels, value, onChange }) {
  return (
    <Select
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
