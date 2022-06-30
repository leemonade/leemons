import React from 'react';
import { Select, createStyles } from '@bubbles-ui/components';

const useStyle = createStyles((theme) => ({
  root: {},
}));

export default function CenterAlignedSelect(props) {
  const { theme } = useStyle();
  return (
    <Select
      {...props}
      style={{
        display: 'flex',
        flexDirecton: 'row',
        alignItems: 'center',
        gap: theme.spacing[4],
      }}
      headerStyle={{
        width: 'auto',
      }}
    />
  );
}
