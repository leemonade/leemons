import React from 'react';
import { Title } from '@bubbles-ui/components';
import PackageInfo from './../../package.json';

export const Welcome = () => {
  return (
    <div>
      <Title order={1} sx={({ colors }) => ({ color: colors.interactive01 })}>
        Users - Leemons Organisms
      </Title>
      <Title
        order={2}
        sx={({ colors }) => ({ color: colors.text02 })}
      >{`React v${PackageInfo.version}`}</Title>
    </div>
  );
};
