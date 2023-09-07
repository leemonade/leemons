import React from 'react';
import { Box, Spotlight } from '@bubbles-ui/components';
import { MainNavBar } from './MainNavBar';
import { menuData } from './mock/menuData';

export default {
  title: 'leemons/MainNavBar',
  parameters: {
    component: MainNavBar,
    design: {
      type: 'figma',
      //   url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    lightMode: { control: 'boolean' },
    // variant: { control: { type: 'select' }, options: LIBRARYCARD_VARIANTS },
    // role: { control: { type: 'select' }, options: LIBRARYCARD_ASSIGMENT_ROLES },
    // onAction: { action: 'onAction' },
  },
};

const Template = ({ ...props }) => (
  <Box style={{ margin: '-1rem' }}>
    <Spotlight>
      <MainNavBar {...props} />
    </Spotlight>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  lightMode: false,
  menuData,
  //   showDescription: true,
  //   showAction: false,
  //   showAssigment: true,
  //   showSubject: true,
  //   variant: 'media',
  //   action: 'View feedback',
  //   badge: '',
  //   ...LIBRARY_CARD_DEFAULT_PROPS,
  //   asset: AUDIO_ASSET,
  //   assigment: {
  //     completed: 0.3,
  //     submission: 15,
  //     total: 24,
  //     subject: {
  //       name: 'Maths - 1025 - GB',
  //     },
  //     avgTime: 933,
  //     avgAttempts: 3,
  //     activityType: 'Tarea/Test',
  //     grade: 8.5,
  //   },
  //   deadlineProps: {
  //     icon: <ArchiveIcon width={16} height={16} />,
  //     deadline: new Date('2022-02-20'),
  //     locale: 'es',
  //     labels: {
  //       new: 'New',
  //       deadline: 'Deadline',
  //     },
  //   },
  //   subject: {
  //     name: 'Bases para el análisis y el tratamiento de',
  //     color: '#FABADA',
  //     icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
  //   },
  //   menuItems: [
  //     {
  //       icon: <StarIcon />,
  //       children: 'Item 1',
  //       onClick: () => alert('Item 1 clicked'),
  //     },
  //     {
  //       icon: <DeleteBinIcon />,
  //       children: 'Item 2',
  //       onClick: () => alert('Item 1 clicked'),
  //     },
  //     {
  //       icon: <FlagIcon />,
  //       children: 'Item 3',
  //       onClick: () => alert('Item 3 clicked'),
  //     },
  //   ],
};
