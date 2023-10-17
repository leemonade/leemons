/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@bubbles-ui/components';
import { UserButton } from './UserButton';
import { session, sessionMenu } from '../../mock/menuData';
import { USER_BUTTON_DEFAULT_PROPS } from './UserButton.constants';

export default {
  title: 'leemons/UserButton',
  parameters: {
    component: UserButton,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/OMMWWv7my6KCmpVwmZ6QcW/Bubbles---Components-(Copy)?node-id=1330%3A19227&mode=dev',
    },
    argTypes: {
      testIsChildrenActive: { control: 'boolean' },
    },
  },
};

const Template = ({ ...props }) => (
  <Box
    style={{
      maxWidth: '100px !important',
      marginLeft: '-1rem',
    }}
  >
    <UserButton {...props} />
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  ...USER_BUTTON_DEFAULT_PROPS,
  session,
  sessionMenu,
  name: 'John Doe',
};
