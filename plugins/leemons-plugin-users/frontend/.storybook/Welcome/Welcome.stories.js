import React from 'react';
import { Welcome as Intro } from './Welcome';
import mdx from './Welcome.mdx';

export default {
  title: ' Getting Started',
  component: Intro,
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Welcome = () => <Intro />;
