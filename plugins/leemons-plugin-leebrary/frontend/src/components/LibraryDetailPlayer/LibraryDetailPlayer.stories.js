import React from 'react';
import { FileIcon, COLORS } from '@bubbles-ui/components';
import { LibraryDetailPlayer } from './LibraryDetailPlayer';
import { LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS } from './LibraryDetailPlayer.constants';
import { LIBRARY_DETAIL_VARIANTS } from '../LibraryDetail';

export default {
  title: 'leemons/Library/LibraryDetailPlayer',
  parameters: {
    component: LibraryDetailPlayer,

    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: LIBRARY_DETAIL_VARIANTS,
    },
  },
};

const Template = ({ children, ...props }) => {
  return <LibraryDetailPlayer {...props}>{children}</LibraryDetailPlayer>;
};

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS,
  fileIcon: <FileIcon fileType={'video'} size={64} color={COLORS.text06} />,
  cover:
    'https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80',
  color: '#DC5571',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  name: 'The Roman Empire',
  fileType: 'document',
  fileExtension: 'pdf',
};
