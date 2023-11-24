import React from 'react';
import { Box } from '@mantine/core';
import { FavButton } from './FavButton';
import { FAV_BUTTON_DEFAULT_PROPS } from './FavButton.constants';

export default {
  title: 'leemons/Library/FavButton',
  parameters: {
    component: FavButton,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
};

const containerStyles = {
  backgroundColor: '#fafafa',
  width: 50,
  height: 50,
  borderRadius: '12px',
  display: 'grid',
  placeContent: 'center',
};

const Template = ({ ...props }) => (
  <Box style={{ ...containerStyles }}>
    <FavButton {...props} />
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  ...FAV_BUTTON_DEFAULT_PROPS,
};
