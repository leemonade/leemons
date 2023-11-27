import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardEmptyCover } from './LibraryCardEmptyCover';

import { LIBRARY_CARD_EMPTY_COVER_DEFAULT_PROPS } from './LibraryCardEmptyCover.constants';

export default {
  title: 'leemons/Library/LibraryCardEmptyCover',
  parameters: {
    component: LibraryCardEmptyCover,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    fileType: { options: ['audio', 'video', 'image', 'bookmark', 'noicon'], control: 'select' },
  },
};

const Template = ({ ...props }) => (
  <Box
    style={{
      width: 300,
      height: 'auto',
      border: '1px solid #DDE1E6',
      borderRadius: '4px',
      marginTop: 6,
    }}
  >
    <Box style={{ marginBottom: 200 }}>
      <LibraryCardEmptyCover {...props} />
    </Box>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  fileType: 'audio',
  ...LIBRARY_CARD_EMPTY_COVER_DEFAULT_PROPS,
};
