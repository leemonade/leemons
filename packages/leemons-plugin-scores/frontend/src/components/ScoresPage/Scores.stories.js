import React from 'react';
import { Box } from '@bubbles-ui/components';
import { Scores } from './Scores';
import { SCORES_DEFAULT_PROPS } from './Scores.constants';
import mdx from './Scores.mdx';

export default {
  title: 'leemons/Pages/Scores',
  parameters: {
    component: Scores,
    docs: {
      page: mdx,
    },
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {},
};

const Template = ({ ...props }) => {
  return <Scores {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SCORES_DEFAULT_PROPS,
};
