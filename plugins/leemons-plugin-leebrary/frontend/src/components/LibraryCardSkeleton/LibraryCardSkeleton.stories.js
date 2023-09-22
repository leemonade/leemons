import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardSkeleton } from './LibraryCardSkeleton';
// import { LIBRARY_CARD_FOOTER_DEFAULT_PROPS } from './LibraryCardSkeleton.constants';

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

Playground.args = {
  // ...LIBRARY_CARD_FOOTER_DEFAULT_PROPS,
  // fileType: 'audio',
  // created: '2022-02-04T16:26:31.485Z',
  // // action: 'View feedback',
  // canAccess: [
  //   { fullName: 'John Doe', permissions: ['owner'] },
  //   { fullName: 'Mary Jane' },
  //   { fullName: 'Peter Parker' },
  //   { fullName: 'Will Teacher' },
  //   { fullName: 'Tony Stark' },
  // ],
};
