/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Spotlight } from '@bubbles-ui/components';
import { BrowserRouter } from 'react-router-dom';
// import { within, userEvent } from '@storybook/testing-library';
// import { expect } from '@storybook/jest';
import { MainNavBar } from './MainNavBar';
import { menuData, session, sessionMenu } from './mock/menuData';
import { MAIN_NAV_BAR_DEFAULT_PROPS } from './MainNavBar.constants';

export default {
  title: 'leemons/MainNavBar',
  parameters: {
    component: MainNavBar,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/OMMWWv7my6KCmpVwmZ6QcW/Bubbles---Components-(Copy)?node-id=1330%3A19227&mode=dev',
    },
  },
  argTypes: {},
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   await userEvent.hover(canvas.getAllByRole('button')[0]);
  //   await userEvent.click(canvas.getAllByRole('button')[1]);
  //   await expect(canvas.getByText('Usuarios')).toBeInTheDocument();
  //   await expect(canvas.getByText('Perfiles')).toBeInTheDocument();
  //   await userEvent.click(canvas.getAllByRole('button')[1]);

  //   await userEvent.click(canvas.getByText('John Doe de todos los santos'));
  //   await expect(canvas.getByText('Cuenta de usuario')).toBeInTheDocument();
  //   await userEvent.click(canvas.getByText('John Doe de todos los santos'));
  //   userEvent.unhover(canvas.getAllByRole('button')[0]);
  // },
};

const Template = ({ testAdminNavTitle, testUseAdminNavTitle, ...props }) => {
  if (testUseAdminNavTitle) {
    props.navTitle = testAdminNavTitle;
  }
  return (
    <Box style={{ margin: '-1rem' }}>
      <Spotlight>
        <BrowserRouter>
          <MainNavBar {...props} />
        </BrowserRouter>
      </Spotlight>
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...MAIN_NAV_BAR_DEFAULT_PROPS,
  menuData,
  sessionMenu,
  session,
  testUseAdminNavTitle: false,
  testAdminNavTitle: '',
};
