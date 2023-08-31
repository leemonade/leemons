import React from 'react';
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
  },
};

const Template = ({ children, ...props }) => {
  return <LibraryCardFooter {...props}>{children}</LibraryCardFooter>;
};

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_CARD_FOOTER_DEFAULT_PROPS,
  fileType: 'audio',
  created: '2022-02-04T16:26:31.485Z',
  action: 'View feedback',
};
