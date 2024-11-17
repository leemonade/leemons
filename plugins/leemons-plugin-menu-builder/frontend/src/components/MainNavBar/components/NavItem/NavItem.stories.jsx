/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@bubbles-ui/components';
import { NavItem } from './NavItem';
import { menuData } from '../../mock/menuData';
import { NAV_ITEM_DEFAULT_PROPS } from './NavItem.constants';

const NavItemElement = menuData[0];

export default {
  title: 'leemons/NavItem',
  parameters: {
    component: NavItem,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/OMMWWv7my6KCmpVwmZ6QcW/Bubbles---Components-(Copy)?node-id=1330%3A19227&mode=dev',
    },
  },
  argTypes: {
    window: { control: 'select', options: ['BLANK', 'SELF', 'NEW'] },
  },
};

const Template = ({ ...props }) => (
  <Box
    style={{
      margin: '-1rem',
      width: '300px',
    }}
  >
    <NavItem {...props} />
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  ...NAV_ITEM_DEFAULT_PROPS,
  childrenCollection: NavItemElement.children,
  iconSvg: NavItemElement.iconSvg,
  label: NavItemElement.label,
  isActive: true,
  isCollapsed: false,
  url: NavItemElement.url,
  window: 'SELF',
  expandedItem: '',
  iconAlt: 'nav item icon',
  isNew: false,
};
