import React, { useState } from 'react';
import { Box, Stack } from '@bubbles-ui/components';
import { LibraryDetail } from './LibraryDetail';
import { LIBRARY_DETAIL_DEFAULT_PROPS, LIBRARY_DETAIL_VARIANTS } from './LibraryDetail.constants';
import {
  VIDEO_ASSET,
  AUDIO_ASSET,
  IMAGE_ASSET,
  URL_ASSET,
  PDF_ASSET,
  AFRAME_ASSET,
} from '../LibraryCard/mock/data';

export default {
  title: 'leemons/Library/LibraryDetail',
  parameters: {
    component: LibraryDetail,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/%F0%9F%8D%8B%F0%9F%92%A7-Bubbles-SD-v2?node-id=6757%3A75141',
    },
  },
  argTypes: {
    variant: { options: LIBRARY_DETAIL_VARIANTS, control: { type: 'select' } },
    onEdit: { action: 'onEdit' },
    onDuplicate: { action: 'onDuplicate' },
    onDownload: { action: 'onDownload' },
    onDelete: { action: 'onDelete' },
    onShare: { action: 'onShare' },
    onAssign: { action: 'onAssign' },
    onClose: { action: 'onClose' },
  },
};

const Template = ({ children, asset, ...props }) => {
  const [open, setOpen] = useState(true);
  return (
    <Box style={{ display: 'flex', gap: 30, height: 'calc(100vh - 32px)' }}>
      <Box style={{ position: 'relative', width: 360 }}>
        <LibraryDetail
          {...props}
          asset={AFRAME_ASSET}
          variant="3d"
          style={{ width: 360 }}
          excludeMetadatas={['bgFromColor', 'bgToColor']}
        >
          {children}
        </LibraryDetail>
      </Box>

      <Box style={{ position: 'relative', width: 360 }}>
        <LibraryDetail {...props} asset={asset} style={{ width: 360 }}>
          {children}
        </LibraryDetail>
      </Box>
      <Box style={{ position: 'relative', width: 360 }}>
        <LibraryDetail {...props} asset={PDF_ASSET} style={{ width: 360 }}>
          {children}
        </LibraryDetail>
      </Box>
      <Box style={{ position: 'fixed', right: 0, width: open ? 360 : 0, height: '100%' }}>
        <LibraryDetail
          {...props}
          style={{ width: 360 }}
          asset={URL_ASSET}
          variant="bookmark"
          open={open}
          onToggle={() => setOpen(!open)}
        >
          {children}
        </LibraryDetail>
      </Box>
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_DETAIL_DEFAULT_PROPS,
  asset: VIDEO_ASSET,
};
