import React from 'react';
import { Paper } from '@bubbles-ui/components';
import { LibraryItem } from './LibraryItem';
import { LIBRARY_ITEM_DEFAULT_PROPS, LIBRARY_ITEM_SIZES } from './LibraryItem.constants';
import { AUDIO_ASSET } from '../LibraryCard/mock/data';

export default {
  title: 'Leemons/Library/LibraryItem',
  parameters: {
    component: LibraryItem,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    size: { options: LIBRARY_ITEM_SIZES, control: { type: 'select' } },
  },
};

const Template = ({ ...props }) => {
  return <LibraryItem {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_ITEM_DEFAULT_PROPS,
  asset: AUDIO_ASSET,
};

const PaperTemplate = ({ ...props }) => {
  return (
    <Paper bordered padding={1} radius="xs">
      <LibraryItem {...props} />
    </Paper>
  );
};

export const PaperExample = PaperTemplate.bind({});

PaperExample.args = {
  ...LIBRARY_ITEM_DEFAULT_PROPS,
  asset: AUDIO_ASSET,
};
