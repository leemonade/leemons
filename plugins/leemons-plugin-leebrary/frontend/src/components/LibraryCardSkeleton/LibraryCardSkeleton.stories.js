import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardSkeleton } from './LibraryCardSkeleton';

export default {
  title: 'leemons/Library/LibraryCardSkeleton',
  parameters: {
    component: LibraryCardSkeleton,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    onAction: { action: 'onAction' },
  },
};

const Template = ({ ...props }) => (
  <Box style={{ width: 322, height: 100 }}>
    <LibraryCardSkeleton {...props} />
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {};
