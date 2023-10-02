import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardFooter } from './LibraryCardFooter';
import { LIBRARY_CARD_FOOTER_DEFAULT_PROPS } from './LibraryCardFooter.constants';

export default {
  title: 'leemons/Library/LibraryCardFooter',
  parameters: {
    component: LibraryCardFooter,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    onAction: { action: 'onAction' },
    fileType: { options: ['audio', 'video', 'image', 'bookmark', 'noicon'], control: 'select' },
  },
};

const Template = ({ ...props }) => (
  <Box
    style={{
      width: 300,
      height: 70,
      border: '1px solid #DDE1E6',
      borderTop: '1px solid transparent',
      borderRadius: '0 0 4px 4px',
      paddingTop: 12,
    }}
  >
    <LibraryCardFooter {...props} />
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_CARD_FOOTER_DEFAULT_PROPS,
  fileType: 'audio',
  created: '2022-02-04T16:26:31.485Z',
  // action: 'View feedback',
  canAccess: [
    { fullName: 'John Doe', permissions: ['owner'] },
    { fullName: 'Mary Jane' },
    { fullName: 'Peter Parker' },
    { fullName: 'Will Teacher' },
    { fullName: 'Tony Stark' },
  ],
};
