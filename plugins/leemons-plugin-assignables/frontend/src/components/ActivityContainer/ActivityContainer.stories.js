import React from 'react';
import { ContextContainer, Paragraph } from '@bubbles-ui/components';
import { ActivityContainer } from './ActivityContainer';
import { ACTIVITY_CONTAINER_DEFAULT_PROPS } from './ActivityContainer.constants';

export default {
  title: 'leemons/ActivityContainer',
  parameters: {
    component: ActivityContainer,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {},
};

const Template = ({ ...props }) => {
  return <ActivityContainer {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...ACTIVITY_CONTAINER_DEFAULT_PROPS,
  header: {
    title: 'La historia detrás del cuadro que tiene más de dos lineas',
    icon: 'https://icon-library.com/images/white-globe-icon/white-globe-icon-24.jpg',
    color: '#4F96FF',
    image:
      'https://images.unsplash.com/photo-1651874221995-23c71b639f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1Mzk4NTc1NA&ixlib=rb-1.2.1&q=80&w=1080',
    subjects: [
      {
        name: 'Historia - G01',
        icon: 'https://static.thenounproject.com/png/447685-200.png',
        color: '#FABADA',
      },
      {
        name: 'Geografia - G01',
        icon: 'https://static.thenounproject.com/png/447685-200.png',
        color: 'green',
      },
      {
        name: 'Matematicas - G01',
        icon: 'https://static.thenounproject.com/png/447685-200.png',
        color: 'red',
      },
    ],
    activityType: {
      icon: 'https://static.thenounproject.com/png/447685-200.png',
      type: 'Tarea',
    },
    activityEvaluation: 'Puntuable',
    activityDates: {
      startLabel: 'Desde',
      endLabel: 'Hasta',
      hourLabel: 'Hora',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
    alertDays: 29,
  },
  deadline: {
    label: 'Entrega',
    deadline: new Date('2022-05-22'),
  },
  children: (
    <ContextContainer sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02 })}>
      <ContextContainer padded spacing={10}>
        {[...Array(5).keys()].map((i) => (
          <Paragraph key={`p${i}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Paragraph>
        ))}
      </ContextContainer>
    </ContextContainer>
  ),
};
