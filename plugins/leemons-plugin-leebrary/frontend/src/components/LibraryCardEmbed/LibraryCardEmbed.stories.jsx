import React from 'react';
import { Paper } from '@bubbles-ui/components';
import { LibraryCardEmbed } from './LibraryCardEmbed';
import { URL_ASSET } from '../LibraryCard/mock/data';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_VARIANTS,
} from './LibraryCardEmbed.constants';

export default {
  title: 'leemons/Library/LibraryCardEmbed',
  parameters: {
    component: LibraryCardEmbed,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: LIBRARY_CARD_EMBED_VARIANTS },
    onDownload: { action: 'onDownload' },
  },
};

const Template = ({ useOnDownload, ...props }) => (
  <Paper color="solid">
    <LibraryCardEmbed {...props} onDownload={useOnDownload ? props.onDownload : undefined} />
  </Paper>
);

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  useOnDownload: true,
  asset: URL_ASSET,
  labels: {
    link: 'Ir al enlace',
  },
};
