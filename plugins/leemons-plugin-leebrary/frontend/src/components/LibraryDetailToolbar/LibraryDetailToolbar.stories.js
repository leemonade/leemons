import React from 'react';
import { LibraryDetailToolbar } from './LibraryDetailToolbar';
import { LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS } from './LibraryDetailToolbar.constants';

export default {
  title: 'leemons/Library/LibraryDetailToolbar',
  parameters: {
    component: LibraryDetailToolbar,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {},
};

const Template = ({ children, ...props }) => {
  return <LibraryDetailToolbar {...props}>{children}</LibraryDetailToolbar>;
};

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_DETAIL_TOOLBAR_DEFAULT_PROPS,
  id: '620bbb607129df59430f3329',
  toolbarEvents: {
    onEdit: (id) => {
      alert('onEdit: ' + id);
    },
    onDuplicate: (id) => {
      alert('onDuplicate: ' + id);
    },
    onDownload: (id) => {
      alert('onDownload: ' + id);
    },
    onDelete: (id) => {
      alert('onDelete: ' + id);
    },
    onShare: (id) => {
      alert('onShare: ' + id);
    },
    onAssign: (id) => {
      alert('onAssign: ' + id);
    },
    onToggle: () => {
      alert('onToggle');
    },
  },
};
